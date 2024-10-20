const mongoose = require('mongoose');

const forgotPasswordSchema = new mongoose.Schema(
    {       
        email: String,
        otp: String, // mã otp
        expireAt: { // thời gian hết hạn
            type: Date,
            expires: 180 // hạn 180s = 3 phút
        }
    }, 
    {
        timestamps: true
    }
);
const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password"); // forgot-password: tên table trong database

module.exports = ForgotPassword;