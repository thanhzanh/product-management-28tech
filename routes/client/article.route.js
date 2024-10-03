const express = require('express');
const router = express.Router();

const controller = require('../../controllers/client/article.controller');

router.get('/', controller.index); // Trang bài viết

router.get('/detail/:slugArticle', controller.detail);

module.exports = router;