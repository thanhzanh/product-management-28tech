const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const articleSchema = new mongoose.Schema(
    {       
        title: String,
        article_category_id: {
            type: String,
            default: ""
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
        deletedBy: { // Xóa bởi ai và thời gian xóa
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
const Article = mongoose.model('Article', articleSchema, "articles"); // articles: tên table trong database

module.exports = Article;