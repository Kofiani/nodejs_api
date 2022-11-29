const { Schema, Types, model } = require('mongoose');

const productSchema = Schema({
    _id : Types.ObjectId,
    name : { type : String, required : true},
    price : { type : Number, required : true},
    productImage : [String]
})

module.exports = model('Product', productSchema)