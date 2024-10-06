const Cart = require('../../models/cart.model');

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    // lấy thông tin gửi lên id, số lượng
    const productId = req.params.productId; // id product
    const quantity = parseInt(req.body.quantity); // so luong
    const cartId = req.cookies.cartId; // cartId

    // Lấy ra giỏ hàng
    const cart = await Cart.findOne({
        _id: cartId
    });
    
    // find() tìm kiếm trong js, tìm 1 bản ghi
    // filter() tìm nhiều bản ghi
    // check xem tồn tại product_id trong giỏ hàng
    const existProductInCart = cart.products.find(item => item.product_id == productId);

    if(existProductInCart) {
        // update sản phẩm(tăng số lượng sản phẩm)
        const quantityNew = quantity + existProductInCart.quantity;
        
        // { } 1: điều kiện tìm, { } 2: set lại quantity
        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id': productId 
            },
            {
                '$set': {
                    'products.$.quantity': quantityNew
                }
            }
        );
        
    } else {
        // Thêm mới sản phẩm và số lượng sp vào giỏ
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };
    
        // luu database
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart } // push vào mảng
            }
        );
    }
    

    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
    res.redirect('back');

}