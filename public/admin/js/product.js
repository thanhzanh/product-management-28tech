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

            // console.log(statusCurrent);
            // console.log(idCurrent);
            // console.log(statusChange);

            const action = path + `/${statusChange}/${idCurrent}?_method=PATCH`
            
            formChangeStatus.action=action;

            formChangeStatus.submit();
        })
    })
}

// End Change status

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

