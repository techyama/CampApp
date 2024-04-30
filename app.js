// モジュールのインストール
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

// 接続が成功したか否か確認
mongoose.connect('mongodb://localhost:27017/movieApp', {useNewUrlParser: true, useUnifiedTopology: true})
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