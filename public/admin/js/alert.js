// public/js/alerts.js
document.addEventListener('DOMContentLoaded', () => {
    const showAlert = document.querySelector('[show-alert]');
    if (showAlert) {
        const time = parseInt(showAlert.getAttribute('data-time'));
        const closeAlert = showAlert.querySelector('[close-alert]');

        // Hiển thị alert
        showAlert.style.right = '20px'; // Điều chỉnh vị trí để hiển thị alert

        setTimeout(() => {
            showAlert.classList.add('alert-hidden');
        }, time);

        closeAlert.addEventListener('click', () => {
            showAlert.classList.add('alert-hidden');
        });
    }
});
