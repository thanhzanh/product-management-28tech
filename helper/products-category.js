const ProductCategory = require('../models/products-category.model');

// Lấy ra những danh mục subCategory: con, truyền vào danh mục cha parentId
module.exports.getSubCategory = async (parentId) => {
    // Hàm getCategory
    const getCategory = async (parentId) => {
        // Tìm tất cả các danh mục con mà có parent_id là parentId
        const subs = await ProductCategory.find({
            parent_id: parentId,
            status: "active",
            deleted: false
        });
        
        let allSub = [...subs]; // tạo mảng mới chứa những mảng cũ subs con của danh mục cha
    
        // Duyệt qua từng subs con và tìm theo cái id bằng đệ quy
        for (const sub of subs) {
            const childs = await getCategory(sub.id);
            allSub = allSub.concat(childs); // sẽ chứa hết tất cẩ các danh mục con ở nhiều cấp, bằng phương pháp nối mảng lại với nhau thông qua concat
        }
    
        return allSub;
    }

    const result = await getCategory(parentId);
    return result;
}

// module.export nên k gọi được getSubCategory