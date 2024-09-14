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
        // deletedAt: Date,
        deletedBy: { // Xóa bởi ai và thời gian xóa
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [ // Chỉnh sửa bởi ai và thời gian Chỉnh sửa vì có thể nhiều người nên dùng mảng
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
const ArticlesCategory = mongoose.model('ArticlesCategory', articlesCategorySchema, "articles-category"); // articles-category: tên table trong database

module.exports = ArticlesCategory;