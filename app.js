// モジュールのインポート
const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const expressErrpr = require('./utils/ExpressError');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
// モデルのインポート
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');

// 接続が成功したか否か確認
mongoose.connect('mongodb://localhost:27017/campApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('接続に成功しました！！');
})
.catch((err) => {
    console.log('接続エラー！！');
    console.log(err);
});

// 静的ファイルの適用
app.use(express.static(path.join(__dirname, 'public')));

// リクエストボディのパース有効化
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// オーバーライドミドルウェアの宣言
app.use(methodOverride('_method'));

// 使用エンジンの設定(EJSを使うときはejs-mateを使う)
app.engine('ejs', ejsMate);
// viewsディレクトリの設定
app.set('views', path.join(__dirname, 'views'));
// テンプレートエンジンの宣言(EJS)
app.set('view engine', 'ejs');

// サーバー起動
app.listen(port, () => {
    console.log(`ポート${port}でリクエスト待受中...`);
});


// ルーティング
app.get('/', (req, res) => {
    res.render('home');
});

// 一覧取得ページ
app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// 新規登録ページ
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// 詳細ページ
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    // パスパラメータで受け取った値で検索
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
}));

// 新規登録
app.post('/campgrounds', catchAsync(async (req, res) => {
    // 不正なリクエストがあったときthrow
    if (!req.body.Campground) throw new ExpressError('不正なキャンプ場のデータです', 400);
    // フォームから受け取った値で登録
    const campground = new Campground(req.body.campground);
    await campground.save();
    // 登録したデータの詳細ページへリダイレクト
    res.redirect(`/campgrounds/${campground._id}`);
}));

// 更新ページ
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    // パスパラメータで受け取った値で検索
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

// 更新
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
    // パスパラメータのIDを持つデータをフォームから受け取った値で更新
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // 更新したデータの詳細ページへリダイレクト
    res.redirect(`/campgrounds/${campground._id}`);
}));

// 削除
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    // パスパラメータのIDを持つデータを削除
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    // 一覧ページへ
    res.redirect('/campgrounds');
}));


// 意図しないパスにリクエストがあったとき
app.all('*', (req, res, next) => {
    next(new ExpressError('ページが見つかりませんでした', 404));
});

// エラーハンドル用ミドルウェア
app.use((err, req, res, next) => {
    const { message = '問題が起きました', statusCode = 500 } = err;
    res.status(statusCode).send(message);
});
