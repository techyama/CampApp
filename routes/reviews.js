// モジュールのインポート
const express = require('express');
// 呼び出し元で定義されたパラメータを有効にする
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
// コントローラーのインポート
const reviews = require('../controllers/reviews');
// ミドルウェアのインポート
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');


// レビュー投稿
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// レビュー削除
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


// モジュールのエクスポート
module.exports = router;