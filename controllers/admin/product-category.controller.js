const ProductCategory = require('../../models/products-category.model');
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
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if(req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    } 

    // Save data vào db
    const record = new ProductCategory(req.body);
    await record.save();

    // Sau khi tạo mới thành công trả về trang danh sách sản phẩm
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [PATCH] /admin/products-category/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {

    const status = req.params.status;
    const id = req.params.id;

    await ProductCategory.updateOne({_id: id}, {status: status});

    res.redirect('back');
    
}

// [PATCH] /admin/products-category/change-multi

module.exports.changeMulti = async (req, res) => {

    const typeStatus = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (typeStatus) {
        case "active":
            await ProductCategory.updateMany({_id: {$in: ids}}, {status: "active"});
            req.flash('success', `Cập nhật trạng thái thành công $${ids.length} sản phẩm!`);       
            break;

        case "inactive":
            await ProductCategory.updateMany({_id: {$in: ids}}, {status: "inactive"});
            req.flash('success', `Cập nhật trạng thái thành công $${ids.length} sản phẩm!`);
            break;

        case "deleted-all":
            await ProductCategory.updateMany(
            {_id: {$in: ids}},
            {
                deleted: true,
                deletedAt: new Date(),
            });
            req.flash('success', `Cập nhật trạng thái thành công $${ids.length} sản phẩm!`);
            break;

        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split('-');

                position = parseInt(position);
                
                await ProductCategory.updateOne(
                    {_id: id},
                    {
                        position: position
                    });
            }
            break;
    
        default:
            break;
    }

    res.redirect('back');
    
}

// [DELETE] /admin/products-category/delete/:id => :id là router động

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    //await Product.deleteOne({id:id}); // Xóa cứng trong database

    await ProductCategory.updateOne({_id:id}, { // xóa mềm, không xóa trong database
        deleted:true,
        deletedAt: new Date()
    }); 

    // Nếu thực thi ok redirect lại trang
    res.redirect('back');
}