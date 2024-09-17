const Article = require('../../models/article.model');
const ArticleCategory = require('../../models/articles-category.model');
const Account = require('../../models/account.model');

const createTreeHelper = require('../../helper/createTree');
const filterStatusHelper = require('../../helper/filterStatus');
const searchHelper = require('../../helper/search');
const paginationHelper = require('../../helper/pagination');

const systemConfig = require("../../config/system");

// -----------------------------------------------------------------------------------------------------

// [GET] /admin/articles
module.exports.index = async (req, res) => {
    
    const find = {
        deleted: false
    }

    // Filter Status
    const filterStatus = filterStatusHelper(req.query);        
    if(req.query.status) {
        find.status = req.query.status;
    }
    
    // Search
    const objectSearch = searchHelper(req.query);
    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Phân trang
    const countArticle = await Article.countDocuments();
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4
        },
        req.query,
        countArticle
    );

    const records = await Article.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

    // Logs Người tạo
    for (const record of records) {
        
        //---------------- Logs Người tạo ----------------
        const createdByUser = await Account.findOne({
            _id: record.createdBy.account_id
        });
        // Nếu tìm thấy thì thêm key accountFullName
        if(createdByUser) {
            record.accountFullName = createdByUser.fullName
        }

        //---------------- Logs Người tạo ----------------
        const updateBy = record.updatedBy[record.updatedBy.length-1];
        if(updateBy) {
            const updatedByUser = await Account.findOne({
                _id: updateBy.account_id
            });

            updateBy.accountFullName = updatedByUser.fullName
        }
    }


    res.render('admin/pages/articles/index', {
        pageTitle: 'Danh sách bài viết',
        data: records,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [GET] /admin/articles/create
module.exports.create = async (req, res) => {
    const find = {
        deleted: false
    }

    const records = await ArticleCategory.find(find);
    // In danh mục bài viết ra ngoài giao diện create bài viết
    const newRecords = createTreeHelper.treeChildren(records);
    
    res.render('admin/pages/articles/create.pug', {
        pageTitle: 'Tạo bài viết',
        records: newRecords
    });
}

// [POST] /admin/articles/create
module.exports.createPost = async (req, res) => {
    // STT
    if(req.body.position == "") {
        const count = await Article.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    // Người tạo
    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    // Lưu database
    const data = new Article(req.body);
    data.save();

    req.flash("success", "Tạo mới bài viết thành công");
    
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
}

// [GET] /admin/articles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
    
        const articles = await Article.findOne(find);
    
        const category = await ArticleCategory.find({ deleted: false });
        // In danh mục bài viết ra ngoài giao diện create bài viết
        const newCategory = createTreeHelper.treeChildren(category);
        
        res.render('admin/pages/articles/edit.pug', {
            pageTitle: 'Chỉnh sửa bài viết',
            articles: articles,
            category: newCategory
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/articles`);     
    }
}

// [PATCH] /admin/articles/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    try {
        // Người chỉnh sửa
        const updatedByUser = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Article.updateOne(
            {
                _id: id
            },
            {
                ...req.body,
                $push: { updatedBy: updatedByUser }
            }
        );

        req.flash("success", "Cập nhật bài viết thành công");

    } catch (error) {
        req.flash("error", "Cập nhật danh bài viết thất bại");
    }
    
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
}

// [DELETE] /admin/articles/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    try {
        await Article.updateOne(
            { _id: id},
            {
                deleted: true,
                deletedBy: { // Logs Người xóa
                    account_id: res.locals.user.id,
                    deletedAt: new Date()    
                }
            }
        );
        req.flash("success", "Xóa bài viết thành công");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Xóa bài viết thất bại");
        res.redirect(`${systemConfig.prefixAdmin}/articles`);
    }
}

// [PATCH] /admin/articles/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    // Logs người update
    const updatedByUser = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Article.updateOne(
        { _id: id }, 
        { 
            status: status,
            $push: { updatedBy: updatedByUser }
        }
    );
    
    req.flash("success", "Cập nhật trạng thái thành công");

    res.redirect("back");
}

// [GET] /admin/articles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const data = await Article.findOne(find);
        
        res.render('admin/pages/articles/detail.pug', {
            pageTitle: 'Chỉnh sửa bài viết',
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/articles`);     
    }
}