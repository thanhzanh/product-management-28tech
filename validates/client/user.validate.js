module.exports.registerPost = async (req, res, next) => {
    if(!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ tên!');
        res.redirect('back');
        return; // Thoát không thực thi những dòng code bên dưới
    }

    if(!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('back');
        return; // Thoát không thực thi những dòng code bên dưới
    }

    if(!req.body.password) {
        req.flash('error', 'Vui lòng nhập password!');
        res.redirect('back');
        return; // Thoát không thực thi những dòng code bên dưới
    }

    next();
}

module.exports.loginPost = async (req, res, next) => {

    if(!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('back');
        return; // Thoát không thực thi những dòng code bên dưới
    }

    if(!req.body.password) {
        req.flash('error', 'Vui lòng nhập password!');
        res.redirect('back');
        return; // Thoát không thực thi những dòng code bên dưới
    }

    next();
}

module.exports.forgotPasswordPost = async (req, res, next) => {

    if(!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');
        res.redirect('back');
        return; // Thoát không thực thi những dòng code bên dưới
    }

    next();
}