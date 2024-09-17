const express = require('express');
const router = express.Router();
const multer  = require('multer');

const upload = multer();

const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

const validate = require('../../validates/admin/article.validate');

const controller = require('../../controllers/admin/article.controller');

router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
    '/create',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.get('/edit/:id', controller.edit);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.patch(
    '/edit/:id',
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);

router.delete('/delete/:id', controller.deleteItem);

module.exports = router;