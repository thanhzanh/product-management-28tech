const Product = require('../../models/product.model');

const productsHelper = require('../../helper/product');

// [GET] /
module.exports.index = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const productFeatured = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(6);

    const newProductsFeatured = productsHelper.priceNewProducts(productFeatured)
    // Lấy ra sản phẩm nổi bật

    // Lấy ra danh sách sản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active",
    }).sort({ position: "desc" }).limit(6);

    const newProductsNew = productsHelper.priceNewProducts(productsNew)
    // Lấy ra danh sách sản phẩm mới nhất

    res.render('client/pages/home/index.pug', {
        pageTitle: 'Trang chủ',
        productFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}