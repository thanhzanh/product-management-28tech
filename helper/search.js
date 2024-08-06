module.exports = (query) => {
    // Tìm kiếm từ data và hiển thị
    let objectSearch = {
        keyword: ""
    }

    if(query.keyword) {

        objectSearch.keyword = query.keyword; // lấy yêu cầu người dùng gán vào keyword: ""

        const regex = new RegExp(objectSearch.keyword, "i"); // lấy keyword người dùng nhập vào, i là không phân biệt chữ hoa chữ thường
        objectSearch.regex = regex; // Nếu có regex thì thêm 1 regex vào trong objectSearch
    }

    return objectSearch;
}