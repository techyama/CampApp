// モジュールのインポート
const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
// モデルのインポート
const ExpressError = require('./utils/ExpressError');
const { redirect } = require('statuses');
// ルーティングのインポート
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

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


// ルーティングミドルウェアを使用
app.use('/campgrounds', campgroundRoutes);
// パラメータをルーティングファイルで使うために設定必要
app.use('/campgrounds/:id/reviews', reviewRoutes);


// 意図しないパスにリクエストがあったとき
app.all('*', (req, res, next) => {
    next(new ExpressError('ページが見つかりませんでした', 404));
});

// エラーハンドル用ミドルウェア
app.use((err, req, res, next) => {
    const { message = '問題が起きました', statusCode = 500 } = err;
    res.status(statusCode).render('error', { err });
});
