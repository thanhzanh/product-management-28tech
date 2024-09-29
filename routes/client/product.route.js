const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/product.controller')

router.get('/', controller.index);

router.get('/:slugCategory', controller.category); // Trang danh mục sản phẩm

// router.get('/:slug', controller.detail); // Trang chi tiết sản phẩm theo slug

module.exports = router;