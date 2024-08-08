const Product = require('../../models/product.model');

// import trạng thái hoạt động
const filterStatusHelper = require('../../helper/filterStatus');

// import search
const searchHelper = require('../../helper/search');

// import pagination
const paginationHelper = require('../../helper/pagination');

// [GET] /admin/products

module.exports.index = async (req, res) => {

    // Gọi lại hàm filerStatus import ở trên từ file filerStatus.js
    const filterStatus = filterStatusHelper(req.query);
    console.log(filterStatus)

    // Lọc data từ database
    let find = {
        deleted: false
    }

    if(req.query.status) {
        find.status = req.query.status; // Từ find lấy ra trạng thái phản nổi từ url, viết riêng, có thể viết chung trên find
    }

    // Tìm kiếm từ data và hiển thị
    const objectSearch = searchHelper(req.query);

    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // End tìm kiếm

    //  Pagination: phân trang
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4,
        },
        req.query,
        countProducts
    );

    // End Pagination

    // Truy vấn data từ database
    // limit: giới hạn sản phẩm
    // skip: bỏ qua bao nhiêu sản phẩm
    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip); 

    res.render('admin/pages/products/index.pug', {
        pageTitle: 'Danh sách sản phẩm',
        products: products, // hiển thị ra ngoài giao diện
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] /admin/products/changeStatus/:status/:id => :status. :id là router động

module.exports.changeStatus = async (req, res) => {
    console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({id: id}, {status: status});
    res.redirect('back');
}

// [PATCH] /admin/products/change-multi 

module.exports.changeMulti = async (req, res) => {
    const typeStatus = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (typeStatus) {
        case "active":
            await Product.updateMany({id: {$in: ids}}, {status: "active"});
            break;

        case "inactive":
            await Product.updateMany({id: {$in: ids}}, {status: "inactive"});
            break;
    
        default:
            break;
    }
    // Nếu thực thi ok redirect lại trang
    res.redirect('back');
}