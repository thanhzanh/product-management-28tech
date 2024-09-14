const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {       
        title: String,
        description: String,
        permissions: { // permissions: nhóm quyền
            type: Array,
            default: []
        },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date,
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
const Role = mongoose.model('Role', roleSchema, "roles"); // roles: tên table trong database

module.exports = Role;