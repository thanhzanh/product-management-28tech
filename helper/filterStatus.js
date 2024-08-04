module.exports = (query) => {
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Đang hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Ngừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    // Chuyển đổi trạng thái màu green
    if(query.status) {
        const index = filterStatus.findIndex(item => item.status == query.status);
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => item.status == ""); // Nếu không tìm thấy thì gán active vào Tất cả
        filterStatus[index].class = "active";
    }

    return filterStatus;
}