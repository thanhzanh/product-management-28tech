const categoryMiddleware = require('../../middlewares/client/category.middleware');
const cartMiddleware = require('../../middlewares/client/cart.middleware');

const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');
const articleRoutes = require('./article.route');
const searchRoutes = require('./search.route');
const cartRoutes = require('./cart.route');
const checkoutRoutes = require('./checkout.route');
const userRoutes = require('./user.route');

module.exports = (app) => {
    app.use(categoryMiddleware.category); // Luôn chạy vào categoryMiddleware.category đầu

    app.use(cartMiddleware.cartId); // Luôn chạy vào cartMiddleware.cartId đầu

    app.use('/', homeRoutes);

    app.use('/products', productRoutes);

    app.use('/article', articleRoutes);

    app.use('/search', searchRoutes);

    app.use('/cart', cartRoutes);

    app.use('/checkout', checkoutRoutes);

    app.use('/user', userRoutes);

}