// モジュールのインポート
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');
// モデルのインポート
const Campground = require('./models/campground');
const Review = require('./models/review');

// ログイン済みじゃなければログインを促すミドルウェア
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // 遷移に失敗した画面のURLをセッションに保存
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'ログインしてください');
        return res.redirect('/login');
    }
    next();
};

// キャンプデータバリデーション
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(msg, 400);
    }
    next();
};

// キャンプ認可
module.exports.isCampAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // 投稿者とログインユーザーが一致しなければ拒否
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'そのアクションの権限がありません');
        res.redirect(`/campgrounds/${id}`);
    }
    next();
};

// レビュー認可
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    // レビュアーとログインユーザーが一致しなければ拒否
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'そのアクションの権限がありません');
        res.redirect('/campgrounds/show');
    }
    next();
};

// レビューデータバリデーション
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(detail => detail.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};