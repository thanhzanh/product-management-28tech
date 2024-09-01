// Permissions
const tablePermissions = document.querySelector('[table-permissions]');
if(tablePermissions) {
    const buttonSubmit = document.querySelector('[button-submit]');

    buttonSubmit.addEventListener('click', () => {
        // 2 permissions trùng tên với nhau
        let permissions = [];

        const rows = tablePermissions.querySelectorAll('[data-name]');
        
        rows.forEach(row => {
            const name = row.getAttribute('data-name');
            const inputs = row.querySelectorAll('input');

            if(name == "id") {
                inputs.forEach(input => {
                    const id = input.value;
                    permissions.push({
                        id: id,
                        permissions: []
                    });
                });
            } else {
                inputs.forEach((input, index) => {
                    const inputChecked = input.checked;

                    // console.log(name);
                    // console.log(index);                  
                    // console.log(inputChecked);
                    // console.log("----------");
                    if(inputChecked) {
                        permissions[index].permissions.push(name);

                    }
                });
            }            
      
        });
        console.log(permissions);

        if(permissions.length > 0) {
            const formChangePermissions = document.querySelector('#form-change-permissions');
            const inputPermissions = formChangePermissions.querySelector('input[name="permissions"]');

            // Chuyển permissions sang dạng JSON gửi lên server
            inputPermissions.value = JSON.stringify(permissions);

            // Gửi lêm server
            formChangePermissions.submit();
        }

    });
    
}

// End Permissions

// Permissions data default
const dataRecords = document.querySelector('[data-records]');
if(dataRecords) {
    // Ép kiểu records(dữ liệu) từ server gửi lên
    const records = JSON.parse(dataRecords.getAttribute('data-records'));
    
    const tablePermissions = document.querySelector('[table-permissions]');

    // Duyệt qua từng record và chỉ số của nó
    records.forEach((record, index) => {
        const permissions = record.permissions;

        permissions.forEach(permission => {
            // Duyệt qua từng hàng xem permissions trùng với thằng nào trong database
            const rows = tablePermissions.querySelector(`[data-name='${permission}']`);
            
            const input = rows.querySelectorAll('input')[index];
            // Nếu bằng thì checked ô input đó
            input.checked = true;
        });
        
    });
}
// End Permissions data default


