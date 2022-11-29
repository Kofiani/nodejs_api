const express = require('express');
const router = express.Router();
const Products = require("../models/products");

router.get('/', (req, res, next) => {
    
    Products.find()
    .exec()
    .then(items => {
        const arr = [];
        items.forEach(item => {
            Products.deleteOne( {_id : item._id} )
        });
    })
    .catch( error => {
        res.status(500).json({
            error : error
        })
        }
    )
})

module.exports =router;
