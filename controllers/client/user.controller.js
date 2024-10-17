const User = require('../../models/user.model');
const md5 = require('md5');
// [GET] /user/register
module.exports.register = async (req, res) => {
    console.log("OK");
    
    res.render("client/pages/user/index", {
        pageTitle: 'Đăng ký tài khoản'
    });
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {

    // check email tồn tại chưa
    const existEmail = await User.findOne({
        email: req.body.email
    });

    if(existEmail) {
        req.flash('error', "Đã tồn tại email");
        res.redirect('back');
        return;
    } else {
        // mã hóa mật khẩu
        req.body.password = md5(req.body.password);

        // lưu vào database
        const user = new User(req.body);
        await user.save();

        // lưu cookies
        res.cookie("tokenUser", user.tokenUser);

        // console.log(user);

        res.redirect("/");
    }

    
}