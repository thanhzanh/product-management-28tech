// button-status
const buttonStatus = document.querySelectorAll("[button-status]");

if(buttonStatus.length > 0) {

    // Lấy ra url
    // url có hàm new URL: để phân tích url, thêm key thay đổi param
    let url = new URL(window.location.href);
    console.log(url);

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            
            if(status) {
                url.searchParams.set("status", status); // url.searchParams.set set lại status phía sau ?
            } else {
                url.searchParams.delete("status"); // Nếu k có thì sẽ delete status còn lại /admin/products trên url
            }

            window.location.href = url.href; // Gán url tìm thấy trả về url trình duyệt params(chuyển hướng qua url tìm thấy)
        });
    });
}

// End Button Status

// Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
    formSearch.addEventListener('submit', (e) => {
        let url = new URL(window.location.href);

        e.preventDefault(); // Ngăn chặn hành vi để khi tìm kiếm không load lại trang
        //console.log(e.target.elements.keyword.value); // Lấy ra được giá trị khi nhập vào

        // const keyword = e.target.elements.keyword.value;
        const keyword = document.querySelector('.form-control').value; // lấy data input từ class
        
        if(keyword) {
            url.searchParams.set("keyword", keyword); // url.searchParams.set set lại status phía sau ?
        } else {
            url.searchParams.delete("keyword"); // Nếu k có thì sẽ delete status còn lại /admin/products trên url
        }

        window.location.href = url.href;
    })
}
