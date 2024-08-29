let count = 0; // biến lưu bên ngoài hàm gọi là biến toàn cục
const createTree = (arr, parentId = "") => {
    const tree = [];
        arr.forEach((item) => {
            if(item.parent_id === parentId) {
                count++; // khi parentId thêm bằng thèn cha parent_id thì tăng biến đếm lên 1 để hiển thị STT tăng
                const newItem = item;
                newItem.index = count; // Tạo key index để gán biến count vào   
                const children = createTree(arr, item.id);
                if(children.length > 0) {
                    newItem.children = children;
                }
                tree.push(newItem);
            }
        });
        return tree;
}

module.exports.treeChildren = (arr, parentId = "") => {
    count = 0;
    const tree = createTree(arr, parentId = "");
    return tree;
}