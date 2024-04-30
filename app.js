// モジュールのインポート
const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
// モデルのインポート
const Campground = require('./models/campground');

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
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

// 新規登録ページ
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// 詳細ページ
app.get('/campgrounds/:id', async (req, res) => {
    // パスパラメータで受け取った値で検索
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

// 新規登録
app.post('/campgrounds', async (req, res) => {
    // フォームから受け取った値で登録
    const campground = new Campground(req.body.campground);
    await campground.save();
    // 登録したデータの詳細ページへリダイレクト
    res.redirect(`/campgrounds/${campground._id}`);
});

// 更新ページ
app.get('/campgrounds/:id/edit', async (req, res) => {
    // パスパラメータで受け取った値で検索
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

// 更新
app.put('/campgrounds/:id', async (req, res) => {
    // パスパラメータのIDを持つデータをフォームから受け取った値で更新
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // 更新したデータの詳細ページへリダイレクト
    res.redirect(`/campgrounds/${campground._id}`);
});

// 削除
app.delete('/campgrounds/:id', async (req, res) => {
    // パスパラメータのIDを持つデータを削除
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    // 一覧ページへ
    res.redirect('/campgrounds');
});
