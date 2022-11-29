const express = require('express');
const router = express.Router();

const Order = require('../models/orders');

router.get('/', (req, res, next) => {
    const id = req.originalUrl.split('/');
    Order.findById(id[2])
    .select('-__v')
    .populate('product', "-__v")
    .exec()
    .then(order => {
        if (!order) {
            throw new Error("Order does not exist");
        }
        res.status(200).json({
            order : order,
            request : {
                type : "GET",
                url : "https//localhost:3000/orders"
            }
        });
    })
    .catch(err => {
        console.log(err);
        err.status = 404;
        res.status(404).json({
            error : err.message,
            status : err.status
        });
    });
})

// router.get('/', (req, res, next) => {
//     const id = req.params.orderId;
//     res.status(200).json({
//         message : 'order details',
//         id : id
//     })
// })

router.delete('/', (req, res, next) => {
    const id = req.originalUrl.split('/');
    Order.remove({ _id : id[2]}).exec()
    .then(result => {
        console.log(result)
        if (result.deletedCount < 1){
            throw new Error("Product not found")
        } else {
            res.status(200).json({
                message : `${result._id} was deleted succefully`,
                id : id[2],
                request : {
                    type : "POST",
                    url : "http://localhost:3000/orders"
                }
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            err : err.message
        })
    })
})


module.exports = router;