const Role = require('../../models/role.model');

const systemConfig = require('../../config/system');

// [GET] /admin/roles
module.exports.index = async (req, res) => {

    let find = {deleted: false};

    const records = await Role.find(find);

    res.render('admin/pages/roles/index.pug', {
        pageTitle: 'Nhóm quyền',
        records: records
    });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {

    res.render('admin/pages/roles/create.pug', {
        pageTitle: 'Nhóm quyền',
    });
}

// [GET] /admin/roles/create
module.exports.createPost = async (req, res) => {

    console.log(req.body);

    // Save vào database
    const records = new Role(req.body);
    await records.save();

    res.redirect(`${systemConfig.prefixAdmin}/roles`);
    
}


// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        let find = {
            _id: id,
            deleted: false
        };
        
        const data = await Role.findOne(find);

        console.log(data);
        
        res.render('admin/pages/roles/edit.pug', {
            pageTitle: 'Chỉnh sửa nhóm quyền',
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
    
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
    
        const data = await Role.updateOne({_id: id}, req.body);

        req.flash("success", "Cập nhật nhóm quyền thành công!");
        
        res.redirect('back');
    } catch (error) {
        req.flash("error", "Cập nhật nhóm quyền không thành công!");
    }
    
}