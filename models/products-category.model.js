const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
    {       
        title: String,
        parent_id: {
            type: String,
            default: false
        },
        description: String,
        thumbnail: String,
        status: String,
        position: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true // duy nhat khong trung slug
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },  
    {
        timestamps: true
    }
);
const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "products-category"); // products-category: tên table trong database

module.exports = ProductCategory;