const express = require('express');
const multer  = require('multer');
const router = express.Router();
const storageMulter = require('../../helper/storageMulter');
const upload = multer({ storage: storageMulter() });

const controller = require('../../controllers/admin/product.controller');
const validate = require('../../validates/admin/product.validate');


router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus); // Đúng route đúng phương thức mới chạy vào controller.changeStatus

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);

router.post(
    '/create',
    upload.single('thumbnail'),
    validate.createPost,
    controller.createPost);

router.get('/edit/:id', controller.edit);

module.exports = router;