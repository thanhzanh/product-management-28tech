const express = require('express');

const multer  = require('multer');

const router = express.Router();

// Image
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware');

// Validate
const validate = require('../../validates/admin/account.validate');

const controller = require('../../controllers/admin/account.controller');

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus);

router.get('/create', controller.create);

router.post(
    '/create', 
    upload.single('avatar'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.get('/edit/:id', controller.edit);

router.patch('/edit/:id', 
    upload.single('avatar'),
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch
);

router.get('/detail/:id', controller.detail);

router.delete('/delete/:id', controller.deleteItem);

module.exports = router;