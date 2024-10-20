const User = require('../../models/user.model');
const ForgotPassword = require('../../models/forgot-password.model');
const generateHelper = require('../../helper/generate');
const md5 = require('md5');
// [GET] /user/register
module.exports.register = async (req, res) => {
    
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

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render('client/pages/user/login', {
        pageTitle: 'Đăng nhập'
    });
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // lấy ra thông tin user để check
    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect('back');
        return;
    }

    if(md5(password) !== user.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect('back');
        return;
    }

    if(user.status === "inactive") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect('back');
        return;
    }

    // lưu token user(trả ra cookie)
    res.cookie("tokenUser", user.tokenUser);

    // quay lại trang chủ
    res.redirect('/');
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    // xóa cookies là xong
    res.clearCookie("tokenUser");
    // quay lại trang home
    res.redirect('/');
}

// [GET] /user/logout
module.exports.forgotPassword = async (req, res) => {
    res.render('client/pages/user/forgot-password.pug', {
        pageTitle: 'Lấy lại mật khẩu'
    });
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
    
    // tìm xem tồn tại user đó hay không
    const user = await User.findOne({
        email: email,
        deleted: false
    });
    // check email tồn tại hay không
    if(!user) {
        req.flash("error", "Email không tồn tại!");
        res.redirect('back');
        return;
    }

    // Lưu thông tin vào DB
    const otp = generateHelper.generateRandomNumber(8);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now() // thời gian hiện tại cộng với giây
    }

    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    
    // Nếu tồn tại Email thì gửi mã OTP qua email
    
    
    res.send("OK");
}