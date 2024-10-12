// Cập nhật số lượng sản phẩm trong giỏ hàng
const inputsQuantity = document.querySelectorAll('input[name="quantity"]');
if(inputsQuantity.length > 0) {
    inputsQuantity.forEach(input => {
        input.addEventListener("change", (e) => {
            const productId = input.getAttribute('product-id');
            const quantity = input.value;

            console.log(productId);
            console.log(quantity);
            
            // gửi productId và quantity lên bằng cách này đỡ phải tạo form gửi lên
            window.location.href = `/cart/update/${productId}/${quantity}`;
        });
    });
}


// Hết Cập nhật số lượng sản phẩm trong giỏ hàng
