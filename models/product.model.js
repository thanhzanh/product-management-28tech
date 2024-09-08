const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {       
        title: String,
        product_category_id: {
            type: String,
            default: ""
        },
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true // duy nhat khong trung slug
        },
        createdBy: { // Tạo bởi ai và thời gian tạo
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now // Dùng 1 lần duy nhất
            }
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date // thời gian xóa
    }, 
    {
        timestamps: true
    }
);
const Product = mongoose.model('Product', productSchema, "products"); // products: tên table trong database

module.exports = Product;