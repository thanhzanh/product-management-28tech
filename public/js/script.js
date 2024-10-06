// Show alert
const showAlert = document.querySelector('[show-alert]');
if(showAlert) {
    const time = parseInt(showAlert.getAttribute('data-time'));
    const closeAlert = showAlert.querySelector('[close-alert]');

    setTimeout(() => {
        showAlert.classList.add('alert-hidden');
    }, time);

    closeAlert.addEventListener('click', () => {
        showAlert.classList.add('alert-hidden');
    });
}
// End Show alert

// buttonAddCart = document.querySelector('[button-add]');
// if(buttonAddCart) {
//     buttonAddCart.addEventListener('click', (event) => {
//         event.preventDefault();
//         Swal.fire({
//             position: "text-center",
//             icon: "success",
//             title: "Thêm vào giỏ hàng thành công",
//             showConfirmButton: false,
//             timer: 3000
//           });
//     })
// }
