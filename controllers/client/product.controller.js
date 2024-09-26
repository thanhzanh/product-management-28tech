const Product = require('../../models/product.model.js');

const productsHelper = require('../../helper/product');

// [GET] /products

module.exports.index =  async (req, res) => {
    // sort: sắp xếp item theo position giảm dần
    const products = await Product.find({
    }).sort({position: "desc"});

    // Gía sản phẩm
    const newProducts = productsHelper.priceNewProducts(products);

    res.render('client/pages/products/index.pug', {
        pageTitle: 'Trang danh sách sản phẩm',
        products: newProducts
    });
}

// [GET] /products/:slug

module.exports.detail =  async (req, res) => {

    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
            status: "active"
        }
        
        const product = await Product.findOne(find);
    
        res.render('./client/pages/products/detail', {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect('/products');
    }
}