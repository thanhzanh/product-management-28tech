const Product = require('../../models/product.model');
const productHelper = require('../../helper/product');
// [GET] /search
module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;

    let countProducts;

    // tạo 1 mảng để chứa những product tìm thấy được và trả ra giao diện list product theo keyword
    let newProducts = [];
    // Nếu có keyword
    if(keyword) {
        const regex = new RegExp(keyword, "i"); // tìm theo keyword, i không phân biệt hoa thường

        // Tìm trong model product
        const products = await Product.find({
            title: regex,
            deleted: false,
            status: "active"
        });

        // Gía của product
        newProducts = productHelper.priceNewProducts(products);

        // Số lượng sản phẩm
        countProducts = await Product.countDocuments({ 
            title: regex,
            deleted: false,
            status: "active" 
        });
        
    }
    
    res.render("client/pages/search/search.pug", {
        pageTitle: 'Kết quả tìm kiếm',
        keyword: keyword,
        products: newProducts,
        countProducts: countProducts
    });
}
