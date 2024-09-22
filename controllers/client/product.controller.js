const Product = require('../../models/product.model.js')

// [GET] /products

module.exports.index =  async (req, res) => {
    // sort: sắp xếp item theo position giảm dần
    const products = await Product.find({
    }).sort({position: "desc"});

    const newProducts = products.map(item => (
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(0)
    ))

    res.render('client/pages/products/index.pug', {
        pageTitle: 'Trang danh sách sản phẩm',
        products: products
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