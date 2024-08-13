const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/product.controller');

router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus); // Đúng route đúng phương thức mới chạy vào controller.changeStatus

router.patch('/change-multi', controller.changeMulti);

router.delete('/delete/:id', controller.deleteItem);

router.get('/create', controller.create);

router.post('/create', controller.createPost);

module.exports = router;