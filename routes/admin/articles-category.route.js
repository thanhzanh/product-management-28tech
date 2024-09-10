const express = require('express');
const router = express.Router();
const multer  = require('multer');

const upload = multer();

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const validate = require('../../validates/admin/product-category.validate');

const controller = require('../../controllers/admin/articles-category.controller');

router.get('/', controller.index);

router.get('/create', controller.create);

router.post('/create', 
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

module.exports = router;

