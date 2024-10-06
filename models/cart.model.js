const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {       
        user_id: String, // ai là người thêm giỏ hàng
        products: [ // danh sách sản phẩm
            {
                product_id: String,
                quantity: Number
            }
        ]
    }, 
    {
        timestamps: true
    }
);
const Cart = mongoose.model('Cart', cartSchema, "carts"); // carts: tên table trong database

module.exports = Cart;