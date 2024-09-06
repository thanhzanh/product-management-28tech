const Account = require('../../models/account.model');

const systemConfig = require('../../config/system');

module.exports.requireAuth = async (req, res, next) => {
    // Kiểm tra có phải là token hay không
    if(!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        // Kiểm tra xem có đứng với token trong user account hay không
        // Tìm user thông qua token
        const user = await Account.findOne({ token: req.cookies.token });
        if(!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        } else {
            next();
        }
    }
}