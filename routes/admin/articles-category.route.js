const express = require('express');
const router = express.Router();
const multer  = require('multer');

const upload = multer();

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');
const validate = require('../../validates/admin/articles-category.validate');

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

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', 
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);

router.get('/detail/:id', controller.detail);

router.delete('/delete/:id', controller.deleteItem);

module.exports = router;

