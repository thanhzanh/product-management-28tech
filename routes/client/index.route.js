const categoryMiddleware = require('../../middlewares/client/category.middleware');
const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');

module.exports = (app) => {
    app.use(categoryMiddleware.category); // Luôn chạy vào middleware

    app.use('/', homeRoutes);

    app.use('/products', productRoutes);
}