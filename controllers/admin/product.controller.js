const Product = require('../../models/product.model');

// [GET] /admin/products

module.exports.index = async (req, res) => {

    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Đang hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Ngừng hoạt động",
            status: "inactive",
            class: ""
        }
    ]

    // Lọc data từ database
    let find = {
        deleted: false,
    }

    if(req.query.status) {
        find.status = req.query.status; // Từ find lấy ra trạng thái phản nổi từ url, viết riêng, có thể viết chung trên find
    }

    // Tìm kiếm từ data và hiển thị
    let keyword =""
    if(req.query.keyword) {
        keyword = req.query.keyword;

        const regex = new RegExp(keyword, "i"); // lấy keyword người dùng nhập vào
        find.title = regex;
    }

    // Chuyển đổi trạng thái màu green
    if(req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status);
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => item.status == ""); // Nếu không tìm thấy thì gán active vào Tất cả
        filterStatus[index].class = "active";
    }

    const products = await Product.find(find); // Truy vấn data từ database

    res.render('admin/pages/products/index.pug', {
        pageTitle: 'Danh sách sản phẩm',
        products: products, // hiển thị ra ngoài giao diện
        filterStatus: filterStatus,
        keyword: keyword
    });
}