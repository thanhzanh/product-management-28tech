const Product = require('../../models/product.model');

const productsHelper = require('../../helper/product');

// [GET] /
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(2);

    const newProducts = productsHelper.priceNewProducts(productFeatured)

    res.render('client/pages/home/index.pug', {
        pageTitle: 'Trang chủ',
        productFeatured: newProducts
    });
}