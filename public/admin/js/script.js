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

// End Form Search

// Pagination
const buttonPagination = document.querySelectorAll('[button-pagination]');
if(buttonPagination) {
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            let url = new URL(window.location.href);

            const page = button.getAttribute('button-pagination');

            if(page) {
                url.searchParams.set('page', page);
            } else {
                url.searchParams.delete('page');
            }
            window.location.href = url.href;
        });
    });
}
// End Pagination

// Checkbox Multi
const checkboxMulti = document.querySelector('[checkbox-multi]');
if(checkboxMulti) {
    const inputCheckAll = document.querySelector('input[name="checkall"]');
    const inputId = document.querySelectorAll('input[name="id"]');
    
    inputCheckAll.addEventListener('click', () => {
        console.log(inputCheckAll.checked);
        if(inputCheckAll.checked) {
            inputId.forEach(input => {
                input.checked = true;
            });
        } else {
            inputId.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputId.forEach(input => {
        input.addEventListener('click', () => { 
            const countChecked = checkboxMulti.querySelectorAll('input[name="id"]:checked').length; // Đếm số lượng ô input check
            console.log(countChecked)
            if(countChecked === inputId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;

            }
        })
    })

}
// End Checkbox Multi

// Form change multi
const formChangeMulti = document.querySelector('[form-change-multi]');
if(formChangeMulti) {
    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const checkboxMulti = document.querySelector('[checkbox-multi]');
        const inputsChecked = checkboxMulti.querySelectorAll('input[name="id"]:checked');
        
        if(inputsChecked.length > 0) {
            const ids = [];
            const inputsIds = formChangeMulti.querySelector('input[name="ids"]');
            inputsChecked.forEach(input => {
                const id = input.value;
                ids.push(id);

                
            });

            inputsIds.value = ids.join(', ');

            formChangeMulti.submit();
        } else {
            alert('Vui lòng chọn ít nhất một ô input');
        }
    })
}
// End form change multi