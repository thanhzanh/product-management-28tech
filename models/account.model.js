const mongoose = require('mongoose');

const generate = require('../helper/generate');

const accountSchema = new mongoose.Schema(
    {       
        fullName: String,
        email: String,
        password: String,
        token: { // Xác thực người dùng khi đăng nhập
            type: String,
            default: generate.generateRandomString(20)
        },
        phone: String,
        avatar: String,
        role_id: String,
        status: String,
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
const Account = mongoose.model('Account', accountSchema, "accounts"); // accounts: tên table(collection) trong database

module.exports = Account;