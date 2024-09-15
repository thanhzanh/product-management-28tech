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

    req.flash("success", "Tạo mới danh sách sản phẩm thành công");
    
    res.redirect(`${systemConfig.prefixAdmin}/articles`);
}