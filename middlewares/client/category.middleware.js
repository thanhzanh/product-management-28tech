const ProductCategory = require('../../models/products-category.model');

const createTreeHelper = require('../../helper/createTree');

module.exports.category = async (req, res, next) => {
    let find = {
        deleted: false
    }
    const productCategory = await ProductCategory.find(find);

    const newProductCategory = createTreeHelper.treeChildren(productCategory);    
    
    res.locals.layoutProductCategory = newProductCategory
    
    next();
    
}