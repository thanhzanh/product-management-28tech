const ArticlesCategory = require("../models/articles-category.model")

module.exports.getSubArticleCategory = (req, res) => {
    const getCategory = (req, res) => {
        const subs = ArticlesCategory.find({
            parent_id: parentId,
            deleted: false,
            status: "active"
        });

        
    }
}