const Account = require('../../models/account.model');
const Role = require('../../models/role.model');

// Mã hóa mật khẩu
const md5 = require('md5');

const systemConfig = require('../../config/system');

// [GET] /admin/accounts

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    // select: dùng lấy ra những cái mong muốn(-a lấy ra tất cả ngoại trừ a)
    const records = await Account.find(find).select("-password -token");

    // In ra fullName là tên của quản trị viên, hay quản lý nội dung
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        });
        // Thêm key role cho record
        record.role = role;
    }
    

    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    });
}

// [GET] /admin/accounts/create

module.exports.create = async (req, res) => {

    const roles = await Role.find({ deleted: false });
    
    res.render("admin/pages/accounts/create", {
        pageTitle: "Tạo mới tài khoản",
        roles: roles
    });
}

// [POST] /admin/accounts/create

module.exports.createPost = async (req, res) => {
    // Check email tồn tại hay chưa
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    console.log(emailExist);
    if(emailExist) {
        req.flash("error", `Email ${req.body.email} đã tồn tại`);
        res.redirect('back');
    } else {
        // Mã hóa password trước khi lưu vào database
        req.body.password = md5(req.body.password);

        const record = new Account(req.body);
        await record.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    
}

// [GET] /admin/accounts/edit/:id

module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    };    
    
    try {
        const data = await Account.findOne(find);
    
        const roles = await Role.find({deleted: false});

        res.render("admin/pages/accounts/edit", {
            pageTitle: "Danh sách tài khoản",
            data: data,
            roles: roles
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    
}


// [PATCH] /admin/accounts/edit/:id

module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

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
            delete req.body.password;
        }

        // Update database
        await Account.updateOne({_id: id}, req.body);

        res.redirect('back');
    }
    
}