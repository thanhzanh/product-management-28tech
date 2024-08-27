const ProductCategory = require('../../models/products-category.model');
const systemConfig = require('../../config/system');

// [GET] /admin/products-category

module.exports.index = async (req, res) => {

    // Lọc data từ database
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find);

    res.render('admin/pages/products-category/index.pug', {
        pageTitle: 'Danh mục sản phẩm',
        records: records
    });
}

// [GET] /admin/products-category/create

module.exports.create = async (req, res) => {

    res.render('admin/pages/products-category/create.pug', {
        pageTitle: 'Tạo danh mục sản phẩm',
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