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

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const findDetail = {_id: id, deleted: false};

        const data = await Role.findOne(findDetail);        
        
        res.render('admin/pages/roles/detail.pug', {
            pageTitle: 'Chi tiết nhóm quyền',
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
    
}

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;

    // Xóa cứng(database)
    // await Role.deleteOne({_id: id}, 
    //     {
    //     deleted: true,
    //     deletedAt: new Date()
    // });
    
    // Xóa data(xóa mềm)
    await Role.updateOne(
        {_id: id},
        {
            deleted: true,
            deletedAt: new Date()
        }
    );
    
    res.redirect('back');
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find);

    res.render('admin/pages/roles/permissions.pug', {
        pageTitle: 'Phân quyền',
        records: records
    });
    
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        // Ép kiểu về từ JSON => []
        const permissions = JSON.parse(req.body.permissions)
        
        // Duyệt qua từng phần tử permissions
        for (const item of permissions) {
            const id = item.id;
            const permission = item.permissions;

            // Update database
            await Role.updateOne({_id: id}, {permissions: permission});
        }
        res.flash("success", "Cập nhật phân quyền thành công!");

        res.redirect('back');
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
    }
}