const express = require('express');
const router = express.Router();
const { Types } = require('mongoose')

const orderDetails = require('./order_details')
// const testingG = require('./console');
const Order = require('../models/orders');
const Product = require('../models/products')


router.use('/:orderId', orderDetails) // this is a middleware for this router alone
// router.use(testingG());

router.get('/', (req, res, next) => {
    Order.find()
    .populate('product', "-__v")
    .exec()
    .then(docs => {
        res.status(200).json({
            count : docs.length,
            orders : docs.map(doc => {
                return {
                    _id : doc._id,
                    product : doc.product,
                    quantity : doc.quantity,
                    request : {
                        type : "GET",
                        orderUrl : `http://localhost:3000/orders/${doc._id}`
                    }
                }
            })
        })
    }).catch(err => {
        res.status(500).json({
            error : err.message
        })
    })
})

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            throw new Error("Product not found")

    
        } else {

            const order = new Order({
                _id : Types.ObjectId(),
                product : req.body.productId,
                quantity : req.body.quantity
        
                });
            return order.save()
        }
    })
    .then(result => {
        console.log(result);
        res.status(200).json({
            message : "Order created",
            createdOrder : {
                _id : result._id,
                product : result.product,
                quantity : result.quantity
            },

        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error : "Product Does not exist" })
    })
})

// the code below was moved to another file

// router.get('/:orderId', (req, res, next) => {
//     const id = req.params.orderId;
//     res.status(200).json({
//         message : 'order details',
//         id : id
//     })
// })

// router.delete('/:orderId', (req, res, next) => {
//     const id = req.params.orderId;
//     res.status(200).json({
//         message : 'order deleted',
//         id : id
//     })
// })

module.exports = router;