const ProductCategory = require('../../models/products-category.model');
const Account = require('../../models/account.model');

const systemConfig = require('../../config/system');

const filterStatusHelper = require('../../helper/filterStatus');

const searchHelper = require('../../helper/search');

const createTreeHelper = require('../../helper/createTree');



// [GET] /admin/products-category
module.exports.index = async (req, res) => {

    const filterStatus = filterStatusHelper(req.body);
    console.log(filterStatus);
    

    // Lọc data từ database
    let find = {
        deleted: false
    }

    // Lấy ra children cấp con cha

    if(req.query.status) {
        find.status = req.query.status;
    }

    // Tìm kiếm data
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Sort: sắp xếp
    let sort = {};
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // End sort

    const records = await ProductCategory.find(find)
    .sort(sort);

    // Lấy ra người tạo và người thay đổi và giờ thay đổi
    for (const record of records) {
        // lấy ra user
        const user = await Account.findOne({
            _id: record.createdBy.account_id
        });

        // nếu có user thì add them record 1 key accountFullName
        if (user) {
            record.accountFullName = user.fullName;
        }

        // Logs người cập nhật và thời gian cập nhật
        const updateBy = record.updatedBy[record.updatedBy.length-1];
        if(updateBy) {
            const updatedByUser = await Account.findOne({
                _id: updateBy.account_id
            });

            updateBy.accountFullName = updatedByUser.fullName
        }
        
    }

    const newRecords = createTreeHelper.treeChildren(records);    

    res.render('admin/pages/products-category/index.pug', {
        pageTitle: 'Danh mục sản phẩm',
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    };

    // Lấy ra children cấp con cha

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.treeChildren(records);    

    res.render('admin/pages/products-category/create.pug', {
        pageTitle: 'Tạo danh mục sản phẩm',
        records: newRecords
    });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    // Check phân quyền truy cập bằng token
    // const permissions = res.locals.role.permissions;
    // if(permissions.includes('products-category-create')) {
    //     console.log("Không có quyền");       
    // } else {
    //     res.send("403");
    //     return;
    // }

    if(req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    } 

    // Logs người tạo
    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    // Save data vào db
    const record = new ProductCategory(req.body);
    await record.save();

    req.flash("success", "Tạo mới danh mục sản phẩm thành công");

    // Sau khi tạo mới thành công trả về trang danh sách sản phẩm
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [PATCH] /admin/products-category/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {

    const status = req.params.status;
    const id = req.params.id;

      // Lưu logs người chỉnh sửa
    const updatedByUser = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await ProductCategory.updateOne(
        {_id: id},
        {
            status: status,
            $push: { updatedBy: updatedByUser }
        }
    );

    req.flash("success", "Cập nhật trạng thái thành công");

    res.redirect('back');
    
};

// [PATCH] /admin/products-category/change-multi

module.exports.changeMulti = async (req, res) => {

    const typeStatus = req.body.type;
    const ids = req.body.ids.split(', ');

    // Lưu logs người chỉnh sửa
    const updatedByUser = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (typeStatus) {
        case "active":
            await ProductCategory.updateMany(
                {_id: {$in: ids}}, 
                {
                    status: "active",
                    $push: { updatedBy: updatedByUser }

                }
            );
            req.flash('success', `Cập nhật trạng thái thành công $${ids.length} sản phẩm!`);       
            break;

        case "inactive":
            await ProductCategory.updateMany(
                {_id: {$in: ids}}, 
                {
                    status: "inactive",
                    $push: { updatedBy: updatedByUser }
                }
            );
            req.flash('success', `Cập nhật trạng thái thành công $${ids.length} sản phẩm!`);
            break;

        case "deleted-all":
            await ProductCategory.updateMany(
            {_id: {$in: ids}},
            {
                deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            });
            req.flash('success', `Xóa danh mục sản phẩm thành công`);
            break;

        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split('-');

                position = parseInt(position);
                
                await ProductCategory.updateOne(
                    {_id: id},
                    {
                        position: position,
                        $push: { updatedBy: updatedByUser }

                    });
            }
            req.flash('success', `Thay đổi vị trí thành công`);
            break;
    
        default:
            break;
    }

    res.redirect('back');
    
};

// [DELETE] /admin/products-category/delete/:id => :id là router động

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    //await Product.deleteOne({id:id}); // Xóa cứng trong database

    await ProductCategory.updateOne({_id:id}, { // xóa mềm, không xóa trong database
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    }); 

    req.flash("success", "Xóa danh mục sản phẩm thành công");

    // Nếu thực thi ok redirect lại trang
    res.redirect('back');
};

// [GET] /admin/products-category/edit/:id

module.exports.edit = async (req, res) => {  
    try {
        const id = req.params.id;
        console.log(id);
        
        const data = await ProductCategory.findOne(
            {
                _id: id,
                deleted: false
            }
        );

        const records = await ProductCategory.find({deleted: false});

        const newRecords = createTreeHelper.treeChildren(records);            

        res.render('admin/pages/products-category/edit.pug', {
            pageTitle: 'Chỉnh sửa danh mục sản phẩm',
            data: data,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
    
};

// Phương thức để bấm nút submit chỉnh sửa bên form
// [PATCH] /admin/products-category/edit/:id

module.exports.editPatch = async (req, res) => {  
    
    try {
        const id = req.params.id;

        req.body.position = parseInt(req.body.position); // ép kiểu chuổi sang int
    
        // Lưu logs người chỉnh sửa
        const updatedByUser = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await ProductCategory.updateOne(
            {_id: id}, 
            {
                ...req.body,
                $push: { updatedBy: updatedByUser }
            }
        );
        
        req.flash("success", "Chỉnh sửa danh mục sản phẩm thành công");

    } catch (error) {
        req.flash("success", "Chỉnh sửa danh mục sản phẩm thất bại");
        
    }

    res.redirect('back');
    
};

// [GET] /admin/products-category/detail/:id

module.exports.detail = async (req, res) => {
    try {
        // console.log(req.body);
        const id = req.params.id;
        
        // Lấy dữ liệu trả về view
        const record = await ProductCategory.findOne({_id: id}, req.body);
        
            
        res.render('admin/pages/products-category/detail.pug', {
            pageTitle: 'Chi tiết danh mục sản phẩm',
            record: record
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};