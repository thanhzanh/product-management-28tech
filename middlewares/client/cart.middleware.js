const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {    
    // check xem xếu trong cookies k tồn tại cartId
    // Nếu k tồn tại sẽ tạo 1 cartId: tgian hiện tại + tgian hết hạn
    // Trong tgian này có load lại trang thì sẽ k tạo mới cartId
    // Sau 1 năm mới mất rồi mới tạo lại
    if(!req.cookies.cartId) {
        // Tạo giỏ hàng
        const cart = new Cart();
        await cart.save(); // lưu vào db

        const expiresCookie = 365 *  24 * 60 * 60 * 1000; // xét thời gian là 1 năm

        // Lưu cartId khi tạo giỏ hàng 
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresCookie)  // xét thời gian tồn tại
        });

    } else {
        // Lấy ra giỏ hàng
        const cart = await Cart.findOne({
            _id: req.cookies.cartId
        });

        // lấy ra số lượng sản phẩm
        const totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

        // thêm số lượng vào cart
        cart.totalQuantity = totalQuantity;
        
        res.locals.miniCart = cart;
    }
     
    next();
    
}