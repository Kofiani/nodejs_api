const { response } = require('express');
const express = require('express');
const router = express.Router();
const { Types } = require('mongoose');
const multer = require("multer");
const user_auth = require("../auth/user-auth")

const clearDb = require('./clear');
router.use('/clear', clearDb)

// const storage = multer.diskStorage({
//     destination : function(req, file, cb){
//         cb(null, "./uploads");
//     },
//     filename : function(req, file, cb) {
//         cb(null, new Date().toISOString() + file.originalname);
//     }
// })

const upload = multer({
    // storage : storage,
    storage : multer.diskStorage({
        destination : function(req, file, cb) {
            cb(null, "./uploads");
        },
        filename : function(req, file, cb){
            cb(null, new Date().toISOString() + file.originalname);
        }
    }),
    limits : { fileSize: 1024 * 1024 * 5 },
    fileFilter : function (req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb( null, true )
        } else {
            cb( null, false )
        }

    }    
});

const Product = require('../models/products');

router.get('/', (req, res, next) => {
    console.log(req)
   Product.find()
   .select('name _id price')
   .exec()
   .then(docs => {
    const response = {
        count : docs.length,
        product : docs.map(doc => {
            return {
                id : doc._id,
                name : doc.name,
                price : doc.price,
                request : {
                    type : 'GET',
                    url : `localhost:3000/products/${doc._id}`
                }
            }
        })
    }
    res.status(200).json(response);
   })
   .catch(error => {
    console.log(error);
    res.status(404).json({error : error })
   })
})

router.post('/', user_auth, upload.array('productImage', 2), (req, res, next) => {
    const images = []
    req.files.forEach(item => images.push(item.path))
    // console.log(req.files)
    const product = new Product({
        _id : Types.ObjectId(),
        name : req.body.name,
        price : req.body.price,
        productImage : images
    })
    product.save()
    .then(result => {
        console.log(result);
    res.status(201).json({
        message : 'handling POST requests to localhost:3000/products',
        product : product
    })
    
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error : err.message })
    })
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id : id }, {$set : updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error : error })
    })
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec().then(doc => {
        console.log(doc);
        if (doc) {

            res.status(200).json(doc)
        } else {
            res.status(404).json({ message : 'Product does not exist'})
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error : err})
    }
    )
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id : id})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(error => {
        console.log(error)
        res.status(500).json(error);
    })
})

module.exports = router;