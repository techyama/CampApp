// モジュールのインポート
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');
// モデルのインポート
const Campground = require('../models/campground');
// ミドルウェアのインポート
const { isLoggedIn } = require('../middleware');

// バリデーションミドルウェア
// キャンプデータ用
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


// 一覧取得ページ
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// 新規登録ページ
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// 詳細ページ
router.get('/:id', catchAsync(async (req, res) => {
    // パスパラメータで受け取った値で検索(IDに紐づくreviewとuserデータも取得)
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    // データが存在しないとき一覧ページへリダイレクト
    if (!campground) {
        req.flash('error', 'キャンプ場は見つかりませんでした');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

// 新規登録
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // フォームから受け取った値で登録
    const campground = new Campground(req.body.campground);
    // passportの持つユーザー情報からidをautorプロパティに代入
    campground.author = req.user._id;
    await campground.save();
    // 保存成功時フラッシュ表示
    req.flash('success', '新しいキャンプ場を登録しました');
    // 登録したデータの詳細ページへリダイレクト
    res.redirect(`/campgrounds/${campground._id}`);
}));

// 更新ページ
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    // パスパラメータで受け取った値で検索
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

// 更新
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // パスパラメータのIDを持つデータをフォームから受け取った値で更新
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // 更新成功時フラッシュ表示
    req.flash('success', 'キャンプ場を更新しました');
    // 更新したデータの詳細ページへリダイレクト
    res.redirect(`/campgrounds/${campground._id}`);
}));

// 削除
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    // パスパラメータのIDを持つデータを削除
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    // 削除成功時フラッシュ表示
    req.flash('success', 'キャンプ場を削除しました');
    // 一覧ページへ
    res.redirect('/campgrounds');
}));


// モジュールのエクスポート
module.exports = router;