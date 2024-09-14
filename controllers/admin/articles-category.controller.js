const ArticlesCategory = require("../../models/articles-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helper/createTree");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");

// [GET] /admin/article-category
// Giao diện ngoài trang article-category cùa admin
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  // Filter Status: tất cả, hoạt động, ngững hoạt động
  // Nếu tìm thấy status, gán trong find key status = req.body.status được yêu cầu lên
  const filterStatus = filterStatusHelper(req.body);
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Sắp xếp
  const sortNumber = {};
  if (req.query.sortKey && req.query.sortValue) {
    sortNumber[req.query.sortKey] = req.query.sortValue;
  } else {
    sortNumber.position = "asc";
  }

  const records = await ArticlesCategory.find(find).sort(sortNumber);

  // Lấy ra người tạo và người thay đổi và giờ thay đổi
  for (const record of records) {
    // lấy ra user
    const user = await Account.findOne({
      _id: record.createdBy.account_id,
    });

    // nếu có user thì add them record 1 key accountFullName
    if (user) {
      record.accountFullName = user.fullName;
    }

    // Người chỉnh sửa và thời gian chỉnh sửa gần nhất
    const updateBy = record.updatedBy[record.updatedBy.length - 1];

    if (updateBy) {
      const userUpdated = await Account.findOne({
        _id: updateBy.account_id,
      });

      // Thêm key accountFullName vào trong trường updatedBy
      updateBy.accountFullName = userUpdated.fullName;
    }
  }

  const newRecords = createTreeHelper.treeChildren(records);

  res.render("admin/pages/articles-category/index", {
    pageTitle: "Danh mục bài viết",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] /admin/article-category/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await ArticlesCategory.find(find);

  const newRecords = createTreeHelper.treeChildren(records);

  res.render("admin/pages/articles-category/create.pug", {
    pageTitle: "Tạo mới danh mục bài viết",
    records: newRecords,
  });
};

// [POST] /admin/article-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ArticlesCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // Người tạo
  req.body.createdBy = {
    // biến locals.user là toàn cục
    account_id: res.locals.user.id,
  };

  // Save database
  const data = new ArticlesCategory(req.body);
  data.save();

  //Thông báo
  req.flash("success", "Tạo danh mục bài viết thành công");

  res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
};

// [PATCH] /admin/article-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  
  // Lưu logs người chỉnh sửa
  const updatedByUser = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  // Thay đổi change status trong database
  await ArticlesCategory.updateOne(
    { _id: id }, 
    { 
      status: status,
      $push: { updatedBy: updatedByUser }
    }
    );

  req.flash("success", "Cập nhật trạng thái thành công");

  res.redirect("back");
};

// [PATCH] /admin/article-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const ids = req.body.ids.split(", ");
  const typeChange = req.body.type;

  // Logs người cập nhật
  // Lưu logs người chỉnh sửa
  const updatedByUser = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  switch (typeChange) {
    case "active":
      await ArticlesCategory.updateMany(
        { _id: { $in: ids } },
        { 
          status: "active",
          $push: { updatedBy: updatedByUser } // Lưu logs người cập nhật

        }
      ); // thay đổi active nhìu danh mục
      req.flash("success", "Cập nhật trạng thái thành công");
      break;

    case "inactive":
      await ArticlesCategory.updateMany(
        { _id: { $in: ids } },
        { 
          status: "inactive",
          $push: { updatedBy: updatedByUser } // Lưu logs người cập nhật
        }
      ); // thay đổi inactive nhìu danh mục
      req.flash("success", "Cập nhật trạng thái thành công");
      break;

    case "deleted-all":
      await ArticlesCategory.updateMany(
        // thay đổi inactive nhìu danh mục
        { _id: { $in: ids } },
        {
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
          }
        }
      );
      req.flash("success", "Xóa thành công");
      break;

    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");

        position = parseInt(position);

        await ArticlesCategory.updateOne(
          // Vì duyệt qua từng item có id-position rồi nên updateOne
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedByUser } // Lưu logs người cập nhật
          }
        );
      }
      req.flash("success", "Thay đổi vị trí thành công");
      break;

    default:
      break;
  }

  res.redirect("back");
};

// [GET] /admin/article-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    // Lấy ra data đổ ra view edit
    const data = await ArticlesCategory.findOne({
      _id: id,
      deleted: false,
    });
    const records = await ArticlesCategory.find({ deleted: false });

    const newRecords = createTreeHelper.treeChildren(records);

    res.render("admin/pages/articles-category/edit.pug", {
      pageTitle: "Chỉnh sửa danh mục bài viết",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
  }
};

// [PATCH] /admin/article-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    // Lưu logs người chỉnh sửa
    const updatedByUser = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }

    await ArticlesCategory.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedByUser }
      }
    );

    req.flash("success", "Cập nhật thành công");

  } catch (error) {
    req.flash("success", "Cập nhật thất bại");
  }
  res.redirect("back");
};

// [GET] /admin/article-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await ArticlesCategory.findOne({ _id: id }, req.body);

    res.render("admin/pages/articles-category/detail.pug", {
      pageTitle: "Chi tiết danh mục bài viết",
      data: data,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/articles-category`);
  }
};

// [DELETE] /admin/article-category/delete/:status/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // Thay đổi change status trong database
  await ArticlesCategory.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      }
    }
  );

  req.flash("success", "Xóa danh mục bài viết thành công");

  res.redirect("back");
};
