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

    // Trả về trạng thái yêu cầu từ url
    // console.log(req.query.status);

    let find = {
        deleted: false
    }

    if(req.query.status) {
        find.status = req.query.status; // Từ find lấy ra trạng thái phản nổi từ url, viết riêng, có thể viết chung trên find
    }

    // Chuyển đổi trạng thái màu green
    if(req.query.status) {
        const index = filterStatus.findIndex(item => item.status == req.query.status);
        filterStatus[index].class = "active"
    } else {
        const index = filterStatus.findIndex(item => item.status == ""); // Nếu không tìm thấy thì gán active vào Tất cả
        filterStatus[index].class = "active"
    }

    const products = await Product.find(find);

    // console.log(products)

    res.render('admin/pages/products/index.pug', {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus: filterStatus
    });
}