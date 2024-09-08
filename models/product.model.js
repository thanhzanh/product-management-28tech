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
        // deletedAt: Date // thời gian xóa
        deletedBy: { // Tạo bởi ai và thời gian tạo
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [ // Tạo bởi ai và thời gian tạo vì có thể nhiều người nên dùng mảng
            { 
                account_id: String,
                updatedAt: Date
            }
        ],
    }, 
    {
        timestamps: true
    }
);
const Product = mongoose.model('Product', productSchema, "products"); // products: tên table trong database

module.exports = Product;