const Account = require('../../models/account.model');
// Mã hóa mật khẩu
const md5 = require('md5');


// [GET] /admin/my-account
module.exports.index = async (req, res) => {

    res.render('admin/pages/my-account/index', {
        pageTitle: "Trang thông tin cá nhân"
    });
}

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {

    res.render('admin/pages/my-account/edit', {
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    });
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    const id = res.locals.user.id;

    // Check trùng email
    const emailExist = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    });

    if(emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    } else {
        // Check password
        if(req.body.password) {
            req.body.password = md5(req.body.password);
        } else {
            delete req.body.password; // xóa password thành rỗng
        }

        // Update database
        await Account.updateOne({_id: id}, req.body);

        req.flash("success", "Cập nhật tài khoản thành công");

    }
    
    res.redirect('back');
}