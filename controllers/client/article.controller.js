const Article = require('../../models/article.model');
const ArticleCategory = require('../../models/articles-category.model');

// [GET] /article
module.exports.index = async (req, res) => {
    
    const article = await Article.find({
        deleted: false,
        status: "active"
    });    

    res.render('client/pages/articles/index.pug', {
        pageTitle: 'Trang bài viết',
        article: article
    });
}

// [GET] /article/detail/:slugArticle
module.exports.detail = async (req, res) => {
    const find = {
        deleted: false,
        status: "active",
        slug: req.params.slugArticle
    };

    const article = await Article.findOne(find);

    // if(article.article_category_id) {
    //     const category = await ArticleCategory.find({
    //         _id: article.article_category_id,
    //         status: "active",
    //         deleted: false
    //     });

    //     article.category = category;
    // }
    
    console.log(article);

    res.render('client/pages/articles/detail', {
        pageTitle: 'Trang chi tiết bài viết',
        article: article
    });
}

