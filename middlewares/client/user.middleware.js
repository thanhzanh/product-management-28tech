const User = require('../../models/user.model');

// dùng để khi đăng nhập hiện thông tin client lên giao diện và không còn đăng nhập đăng ký
module.exports.infoUser = async (req, res, next) => {
    // console.log(req.cookies.tokenUser);
    // nếu có tokenUser(đăng nhập rồi) ms lấy ra thông tin cá nhân
    if(req.cookies.tokenUser) {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser,
            deleted: false,
            status: "active"
        });

        // nếu có user trả về biến user toàn cục
        if(user) {
            res.locals.user = user;
        }
    }

    // không có thì vẫn vào home bình thường
    next();
}