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
