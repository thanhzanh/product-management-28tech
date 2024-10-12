const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');

const productHelper = require('../../helper/product');

// [GET] /cart
module.exports.index = async (req, res) => {
    // lấy ra cartd
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    if(cart.products.length > 0) {
        // duyệt qua từng products
        for(const item of cart.products) {
            const productId = item.product_id;
            // lấy ra thông tin sản phẩm có id là product_id
            const productInfo = await Product.findOne({
                _id: productId,
            }).select(" title thumbnail slug price discountPercentage");

            // gán productInfo 1 key priceNew
            productInfo.priceNew = productHelper.priceNewProduct(productInfo);

            // thêm 1 key productInfo vào item
            item.productInfo = productInfo;

            // tổng tiền
            item.totalPrice = productInfo.priceNew * item.quantity;
        }

    }
    // tổng đơn hàng
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

    res.render('client/pages/cart/index', {
        pageTitle: 'Trang giỏ hàng',
        cartDetail: cart
    });
};

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

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    // lấy productId truyền từ params qua và cartId
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    
    // cập nhật lại giỏ hàng
    // 1. bản ghi cập nhật, 2. data cập nhật
    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: { products: { product_id: productId } }
    });
    
    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng");
    
    res.redirect('back');
};

// [GET] /cart/delete/:productId/:quantity
module.exports.update = async (req, res) => {
    // lấy productId truyền từ params qua và cartId
    const cartId = req.cookies.cartId; // giỏ
    const productId = req.params.productId; // id sản phẩm
    const quantity = req.params.quantity; // số lượng sản phẩm

    // trả ra object gồm productId và quantity
    // console.log(req.params); 

    // update lại số lượng
    await Cart.updateOne(
        {
            _id: cartId,
            "products.product_id": productId
        },
        {
            $set: {
                "products.$.quantity": quantity
            }
        }
    );
    
    req.flash("success", "Cập nhật số lượng thành công");
    
    res.redirect('back');
};