// モジュールのインポート
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
// コントローラーのインポート
const campgrounds = require('../controllers/campgrounds');
// ミドルウェアのインポート
const { isLoggedIn, isCampAuthor, validateCampground } = require('../middleware');


// 一覧取得ページ
router.get('/', catchAsync(campgrounds.index));

// 新規登録ページ
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// 詳細ページ
router.get('/:id', catchAsync(campgrounds.showCampground));

// 新規登録
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// 編集ページ
router.get('/:id/edit', isLoggedIn, isCampAuthor, catchAsync(campgrounds.renderEditForm));

// 編集
router.put('/:id', isLoggedIn, isCampAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// 削除
router.delete('/:id', isLoggedIn, isCampAuthor, catchAsync(campgrounds.deleteCampground));


// モジュールのエクスポート
module.exports = router;