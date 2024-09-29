const Product = require('../../models/product.model.js');
const ProductCategory = require('../../models/products-category.model.js');

const productsHelper = require('../../helper/product');
const productsCategoryHelper = require('../../helper/products-category');

// [GET] /products
module.exports.index =  async (req, res) => {
    // sort: sắp xếp item theo position giảm dần
    const products = await Product.find({
    }).sort({position: "desc"});

    // Gía sản phẩm
    const newProducts = productsHelper.priceNewProducts(products);

    res.render('client/pages/products/index.pug', {
        pageTitle: 'Trang danh sách sản phẩm',
        products: newProducts
    });
}

// [GET] /products/:slugProduct
module.exports.detail = async (req, res) => {

    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        }
        
        const product = await Product.findOne(find);

        // Kiểm tra xem có danh mục cha hay không
        if(product.product_category_id) {
            // Tìm danh mục cha nó
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });

            product.category = category;
        }

        // Lấy ra giá mới
        product.priceNew = productsHelper.priceNewProduct(product);
    
        res.render('./client/pages/products/detail', {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect('/products');
    }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    
    // Lấy ra danh mục danh theo slug để tìm ra id của nó
    // slug: req.params.slugCategory lấy từ params qua theo trường slug
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false,
    });   
        

    // Lấy ra những danh mục subCategory: con, truyền vào danh mục cha parentId
    // const getSubCategory = async (parentId) => {
    //     // Tìm tất cả các danh mục con mà có parent_id là parentId
    //     const subs = await ProductCategory.find({
    //         parent_id: parentId,
    //         status: "active",
    //         deleted: false
    //     });
        
    //     let allSub = [...subs]; // tạo mảng mới chứa những mảng cũ subs con của danh mục cha

    //     // Duyệt qua từng subs con và tìm theo cái id bằng đệ quy
    //     for (const sub of subs) {
    //         const childs = await getSubCategory(sub.id);
    //         allSub = allSub.concat(childs); // sẽ chứa hết tất cẩ các danh mục con ở nhiều cấp, bằng phương pháp nối mảng lại với nhau thông qua concat
    //     }

    //     return allSub;
    // }

    // Gọi từ helper qua
    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);

    const listSubCategoryId = listSubCategory.map(item => item.id);    
    
    // Lấy ra sản phẩm theo id danh mục cha
    // $in: lấy ra những id trong mảng gồm nhiều cái dùng $in bên trong
    const products = await Product.find({
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
        deleted: false
    }).sort({ position: "desc" });

   // Giá sản phẩm
   const newProducts = productsHelper.priceNewProducts(products);
    
    res.render('client/pages/products/index.pug', {
        pageTitle: category.title,
        products: newProducts
    });
}