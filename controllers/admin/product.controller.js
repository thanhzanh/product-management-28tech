const Product = require('../../models/product.model');

// import trạng thái hoạt động
const filterStatusHelper = require('../../helper/filterStatus');

const searchHelper = require('../../helper/search');

// [GET] /admin/products

module.exports.index = async (req, res) => {

    // Gọi lại hàm filerStatus import ở trên từ file filerStatus.js
    const filterStatus = filterStatusHelper(req.query);
    console.log(filterStatus)

    // Lọc data từ database
    let find = {
        deleted: false,
    }

    if(req.query.status) {
        find.status = req.query.status; // Từ find lấy ra trạng thái phản nổi từ url, viết riêng, có thể viết chung trên find
    }

    // Tìm kiếm từ data và hiển thị
    const objectSearch = searchHelper(req.query);

    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    const products = await Product.find(find); // Truy vấn data từ database

    res.render('admin/pages/products/index.pug', {
        pageTitle: 'Danh sách sản phẩm',
        products: products, // hiển thị ra ngoài giao diện
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}