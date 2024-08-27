const Product = require('../../models/product.model');

const systemConfig = require('../../config/system');

// import trạng thái hoạt động
const filterStatusHelper = require('../../helper/filterStatus');

// import search
const searchHelper = require('../../helper/search');

// import pagination
const paginationHelper = require('../../helper/pagination');

// [PATCH] /admin/products/changeStatus/:status/:id => :status. :id là router động

module.exports.changeStatus = async (req, res) => {
    console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({_id: id}, {status: status});

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect('back');
}

// [PATCH] /admin/products/change-multi 

module.exports.changeMulti = async (req, res) => {
    const typeStatus = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (typeStatus) {
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active"});
            req.flash('success', `Cập nhật trạng thái thành công $${ids.length} sản phẩm!`);
            break;

        case "inactive":
            await Product.updateMany({id: {$in: ids}}, {status: "inactive"});
            req.flash('success', `Cập nhật trạng thái thành công $${ids.length} sản phẩm!`);
            break;

        case "deleted-all":
            await Product.updateMany(
            {_id: {$in: ids}},
            {
                deleted: true,
                deletedAt: new Date(),
            });
            break;

        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split('-');

                position = parseInt(position);
                
                await Product.updateOne(
                    {_id: id},
                    {
                        position: position
                    });
            }
            break;
    
        default:
            break;
    }
    // Nếu thực thi ok redirect lại trang
    res.redirect('back');
}

// [DELETE] /admin/products/delete/:id => :id là router động

module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    //await Product.deleteOne({id:id}); // Xóa cứng trong database

    await Product.updateOne({_id:id}, { // xóa mềm, không xóa trong database
        deleted:true,
        deletedAt: new Date()
    }); 

    // Nếu thực thi ok redirect lại trang
    res.redirect('back');
}

// [GET] /admin/products

module.exports.index = async (req, res) => {

    // Gọi lại hàm filerStatus import ở trên từ file filerStatus.js
    const filterStatus = filterStatusHelper(req.query);
    console.log(filterStatus)

    // Lọc data từ database
    let find = {
        deleted: false
    }

    if(req.query.status) {
        find.status = req.query.status; // Từ find lấy ra trạng thái phản nổi từ url, viết riêng, có thể viết chung trên find
    }

    // Tìm kiếm từ data và hiển thị
    const objectSearch = searchHelper(req.query);

    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // End tìm kiếm

    //  Pagination: phân trang
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4,
        },
        req.query,
        countProducts
    );

    // End Pagination

    // Sort
    let sort = {};

    // req.query.sortKey, req.query.sortValue tự đặt trên url bên admin
    if(req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    } else {
        sort.position = "desc";
    }
    // End Sort


    // Truy vấn data từ database
    // limit: giới hạn sản phẩm
    // skip: bỏ qua bao nhiêu sản phẩm
    // sort: sắp xếp item theo position giảm dần
    const products = await Product.find(find)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip)
    .sort(sort); 

    res.render('admin/pages/products/index.pug', {
        pageTitle: 'Danh sách sản phẩm',
        products: products, // hiển thị ra ngoài giao diện
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}


// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render('admin/pages/products/create', {
        pageTitle: 'Thêm mới sản phẩm',
    });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    console.log(req.file);

    // Ép kiểu qua cho đúng data type database
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    } 

    console.log(req.body); // Lấy dữ liệu truyền từ form qua controller
    
    // Save data vào db
    const product = new Product(req.body);
    await product.save();

    // Sau khi tạo mới thành công trả về trang danh sách sản phẩm
    res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/products/edit
module.exports.edit = async (req, res) => {

    try {
        console.log(req.params.id);

        const find = {
            deleted: false,
            _id: req.params.id,
        }
        
        const product = await Product.findOne(find);
    
        res.render('admin/pages/products/edit', {
            pageTitle: 'Chỉnh sửa sản phẩm',
            product: product
        });
    } catch (error) {
        req.flash('error', 'Sản phẩm không tồn tại!');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {

    const id = req.params.id;
    // Ép kiểu qua cho đúng data type database
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if(req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    try {
        req.flash('success', 'Cập nhật sản phẩm thành công!');
        await Product.updateOne({_id:id}, req.body);
    } catch (error) {
        
    }

    // Sau khi tạo mới thành công trả về trang danh sách sản phẩm
    res.redirect('back');    
    
};

// [GET] /admin/products/detail
module.exports.detail = async (req, res) => {

    try {
        console.log(req.params.id);

        const find = {
            deleted: false,
            _id: req.params.id,
        }
        
        const product = await Product.findOne(find);

        console.log(product);
        
    
        res.render('admin/pages/products/detail', {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};