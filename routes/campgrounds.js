// モジュールのインポート
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
// 自動でindex.jsを見に行くため/index.js省略可
const { storage } = require('../cloudinary');
// ファイルアップロード先
const upload = multer({ storage });
// コントローラーのインポート
const campgrounds = require('../controllers/campgrounds');
// ミドルウェアのインポート
const { isLoggedIn, isCampAuthor, validateCampground } = require('../middleware');


router.route('/')
    // 一覧取得ページ
    .get(catchAsync(campgrounds.index))
    // 新規登録
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));



// 新規登録ページ
router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    // 詳細ページ
    .get(catchAsync(campgrounds.showCampground))
    // 編集
    .put(isLoggedIn, isCampAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    // 削除
    .delete(isLoggedIn, isCampAuthor, catchAsync(campgrounds.deleteCampground));



// 編集ページ
router.get('/:id/edit', isLoggedIn, isCampAuthor, catchAsync(campgrounds.renderEditForm));


// モジュールのエクスポート
module.exports = router;