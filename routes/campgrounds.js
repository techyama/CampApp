// モジュールのインポート
const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');
// モデルのインポート
const Campground = require('../models/campground');

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
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// 詳細ページ
router.get('/:id', catchAsync(async (req, res) => {
    // パスパラメータで受け取った値で検索(IDに紐づくreviewデータも取得)
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

// 新規登録
router.post('/', validateCampground, catchAsync(async (req, res) => {
    // フォームから受け取った値で登録
    const campground = new Campground(req.body.campground);
    await campground.save();
    // 登録したデータの詳細ページへリダイレクト
    res.redirect(`/campgrounds/${campground._id}`);
}));

// 更新ページ
router.get('/:id/edit', catchAsync(async (req, res) => {
    // パスパラメータで受け取った値で検索
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

// 更新
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    // パスパラメータのIDを持つデータをフォームから受け取った値で更新
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // 更新したデータの詳細ページへリダイレクト
    res.redirect(`/campgrounds/${campground._id}`);
}));

// 削除
router.delete('/:id', catchAsync(async (req, res) => {
    // パスパラメータのIDを持つデータを削除
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    // 一覧ページへ
    res.redirect('/campgrounds');
}));


// モジュールのエクスポート
module.exports = router;