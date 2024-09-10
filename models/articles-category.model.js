const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const articlesCategorySchema = new mongoose.Schema(
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
const ArticlesCategory = mongoose.model('ArticlesCategory', articlesCategorySchema, "articles-category"); // articles-category: tên table trong database

module.exports = ArticlesCategory;