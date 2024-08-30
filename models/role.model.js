const mongoose = require('mongoose');

mongoose.plugin(slug);

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
        deletedAt: Date
    }, 
    {
        timestamps: true
    }
);
const Role = mongoose.model('Role', productSchema, "roles"); // roles: tên table trong database

module.exports = Role;