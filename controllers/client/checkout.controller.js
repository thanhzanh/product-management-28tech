const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');

const productHelper = require('../../helper/product');

// [GET] /checkout/
module.exports.index = async (req, res) => {
    // Lấy ra cartId
    const cartId = req.cookies.cartId;
    
    // tìm giỏ hàng có cartId đó
    const cart = await Cart.findOne({
        _id: cartId
    });

    // tìm nếu có sản phẩm và số lượng thì duyệt qua từng products trong cart
    if(cart.products.length > 0) {
        for(const product of cart.products) {
            // lấy ra thông tin sản phẩm có product_id
            const productInfo = await Product.findOne({
                _id: product.product_id
            }).select("title slug thumbnail price discountPercentage");
            
            // thêm key thông tin sản phẩm vào product
            product.productInfo = productInfo;

            // thêm giá mới vào thông tin productInfo
            productInfo.priceNew = productHelper.priceNewProduct(productInfo);
            
            // tổng tiền
            product.totalPrice = productInfo.priceNew * product.quantity;
        }

    }
    // Tổng tiền đơn hàng
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
    

    res.render('client/pages/checkout/index', {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    })
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    // const userInfo = {
    //     fullName: req.body.fullName,
    //     phone: req.body.phone,
    //     address: req.body.address
    // }
    const userInfo = req.body;

    // Tìm giỏ hàng có cartId
    const cart = await Cart.findOne({
        _id: cartId
    });

    // tạo ra mảng products
    const products = [];

    if(cart.products.length > 0) {
        for(const product of cart.products) {
            const objectProduct = {
                product_id: product.product_id,
                price: 0,
                discountPercentage: 0,
                quantity: product.quantity
            };

            // thông tin sản phẩm gửi lên trong giỏ hàng: giá và giảm giá
            const productInfo = await Product.findOne({
                _id: product.product_id
            }).select("price discountPercentage");

            objectProduct.price = productInfo.price;
            objectProduct.discountPercentage = productInfo.discountPercentage;

            // thêm objectProduct vào mảng products
            products.push(objectProduct);
        }
    }

    // ************** Thông tin đặt hàng **************
    const orderIndo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    };

    // ************** Lưu vào order **************
    const order = new Order(orderIndo);
    order.save();

    // ************** Set lại giỏ hàng là trống **************
    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    });
    
    res.redirect(`/checkout/success/${order.id}`);
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const orderId = req.params.id;
    console.log(orderId);
    

    res.render('client/pages/checkout/success', {
        pageTitle: "Đặt hàng thành công"
    })
}