const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {       
        id: Number,
        title: String,
        description: String,
        category: String,
        price: Number,
        discountPercentage: Number,
        rating: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        deleted: Boolean
    }
);
const Product = mongoose.model('Product', productSchema, "products"); // products: tên table trong database

module.exports = Product;