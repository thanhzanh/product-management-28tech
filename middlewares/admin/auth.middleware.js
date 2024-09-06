const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

const systemConfig = require('../../config/system');

module.exports.requireAuth = async (req, res, next) => {
    // Kiểm tra có phải là token hay không
    if(!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        // Kiểm tra xem có đứng với token trong user account hay không
        // Tìm user thông qua token, select bỏ qua pasword
        const user = await Account.findOne({ token: req.cookies.token }).select("-password");
        if(!user) {
            res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        } else {
            // Lấy ra role tương ứng với user(title, permissions)
            const role = await Role.findOne({ _id: user.role_id }).select("title permissions");

            // Trả về user local(frontend), truy cập vào file pug nào cũng có          
            res.locals.user = user;
            res.locals.role = role;
            next();
        }
    }
}