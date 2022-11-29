const { Schema, Types, model } = require('mongoose');

const orderSchema = Schema({
    _id : Types.ObjectId,
    product : {type: Types.ObjectId, ref : "Product", required : true},
    quantity : {type : Number, default : 1}
})

module.exports = model('Order', orderSchema)