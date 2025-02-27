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
    });
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
const checkboxMulti = document.querySelector('[checkbox-multi]'); // lấy ra table
if(checkboxMulti) {
    const inputCheckAll = document.querySelector('input[name="checkall"]');
    const inputId = document.querySelectorAll('input[name="id"]');
    
    // tick vào ô nào thì ô đó checked true 
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

    // tick các input đầy đủ thì ô tick tất cả đc tick và ngược lại
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

        // Chọn xóa tất cả
        // Lấy ra value="deleted-all"
        const typeChange = e.target.elements.type.value;
        if(typeChange === "deleted-all") {
            const isConfirm = confirm('Bạn có chắc chắn muốn xóa những sản phẩm này?');
            
            // Nếu người dùng bấm hủy thì sẽ không thực hiện đoạn code dưới nó
            if(!isConfirm) {
                return;
            }
        }
        
        if(inputsChecked.length > 0) {
            const ids = [];
            const inputsIds = formChangeMulti.querySelector('input[name="ids"]');
            inputsChecked.forEach(input => {
                const id = input.value;

                if(typeChange == "change-position") {
                    
                    //closest('tr) input Đi ra thẻ cha tr nó
                    const position = input.closest('tr').querySelector('input[name="position"]').value;

                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }             
            });

            inputsIds.value = ids.join(', ');

            formChangeMulti.submit();
        } else {
            alert('Vui lòng chọn ít nhất một ô input');
        }
    })
}
// End form change multi

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

// Upload image
const uploadImage = document.querySelector('[upload-image]');
if(uploadImage) {
    const uploadImageInput = document.querySelector('[upload-image-input]');
    const uploadImagePreview = document.querySelector('[upload-image-preview]');

    uploadImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
        
    })

    

}
// End upload image

// Sort
const sort = document.querySelector('[sort]'); // Lấy tên tự đặt bên thẻ div
if(sort) { // Nếu có thì ta mới thực hiện

    let url = new URL(window.location.href); // lấy url của trình duyệt

    const sortSelect = document.querySelector('[sort-select]');
    const sortClear = document.querySelector('[sort-clear]');
    
    // Sắp xếp
    sortSelect.addEventListener('change', (e) => {
       
        const value = e.target.value; // lấy value của từng option trong select
        // Cú pháp destructuring
        const [sortKey, sortValue] = value.split('-');

        url.searchParams.set('sortKey', sortKey);
        url.searchParams.set('sortValue', sortValue);

        window.location.href = url.href;
        
    });

    // Xóa sắp xếp
    sortClear.addEventListener('click', () => {
        url.searchParams.delete('sortKey');
        url.searchParams.delete('sortValue');

        window.location.href = url.href;
    });

    // Thêm selected cho option khi được chọn sẽ hiển thị
    const sortKey = url.searchParams.get('sortKey'); 
    const sortValue = url.searchParams.get('sortValue'); 

    if(sortKey && sortValue) {
        // Dùng để so sánh với value bên option
        const stringSort = `${sortKey}-${sortValue}`;

        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected = true;
        
    }

}

// End Sort


// Button delete   
const buttonDelete = document.querySelectorAll('[button-delete]');
if(buttonDelete.length > 0) {

    // Lấy form
    const formDeleteItem = document.querySelector('#form-delete-item');
    const path=formDeleteItem.getAttribute('data-path');

    buttonDelete.forEach(button => {
        button.addEventListener('click', () => {
            const isConfirm = confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');

            if(isConfirm) {
                const id = button.getAttribute('data-id');
                
                // const action = path + `/${id}`;
                const action = `${path}/${id}?_method=DELETE`;

                formDeleteItem.action=action;

                formDeleteItem.submit();

            }
        });
    });
}

// End Button delete

// Change status
const buttonChangeStatus = document.querySelectorAll('[button-change-status]');
if(buttonChangeStatus.length > 0) {

    const formChangeStatus = document.querySelector('#form-change-status');
    const path = formChangeStatus.getAttribute('data-path');
    console.log(path)

    buttonChangeStatus.forEach(button => {
        button.addEventListener('click', () => {
            const statusCurrent = button.getAttribute('data-status');
            const idCurrent = button.getAttribute('data-id');

            let statusChange = statusCurrent === "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${idCurrent}?_method=PATCH`
            
            formChangeStatus.action=action;

            formChangeStatus.submit();
        });
    });
}

// End Change status

// Click user
let account = document.querySelector('.inner-account');
let subListInfoUser = document.querySelector('.sub-info-user');
if(account) {
    account.addEventListener("click", () => {
        if(subListInfoUser) {
            if(subListInfoUser.style.display === 'block') {
                subListInfoUser.style.display = 'none';
            } else {
                subListInfoUser.style.display = 'block';
            }
        };
        
    });
}

// End click user
