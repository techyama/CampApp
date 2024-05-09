// Node.jsの環境変数が本番用で動いていないときに読み込む
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// モジュールのインポート
const path = require('path');
const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// セッションモジュールインポート
const session = require('express-session');
// フラッシュモジュールインポート
const flash = require('connect-flash');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
// モデルのインポート
const ExpressError = require('./utils/ExpressError');
const { redirect } = require('statuses');
// ルーティングのインポート
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
// 認証・認可ライブラリとモデルのインポート
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
// セキュリティ対策ライブラリ
const mongoSanitize = require('express-mongo-sanitize');

// 接続が成功したか否か確認
mongoose.connect('mongodb://localhost:27017/campApp', {
    // オプション
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
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

// セッション有効化
const sessionConfig = {
    // セッション名を変更できる
    name: 'hoge',
    // 本来は秘密鍵が好ましい
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // HTTP接続のみ受け付ける
        httpOnly: true,
        // HTTPS通信のみクッキーのやり取りをする(ローカル環境ではHTML通信なのでデプロイ時に適用)
        // secure: true,
        // 有効期限(ミリ秒)7日
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

// 認証用ミドルウェア
app.use(passport.initialize());
app.use(passport.session());
// モデルに定義された情報で認証情報を設定
passport.use(new LocalStrategy(User.authenticate()));
// ユーザーの情報をセッションに入れるときの設定
passport.serializeUser(User.serializeUser());
// セッションからユーザー情報を取り出すときの設定
passport.deserializeUser(User.deserializeUser());

// フラッシュの有効化
app.use(flash());

// フラッシュ用ミドルウェア
app.use((req, res, next) => {
    // ライフサイクルの間レスポンスプロパティにリクエストプロパティの値を保持する
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// サニタイジングミドルウェア
app.use(mongoSanitize());


// サーバー起動
app.listen(port, () => {
    console.log(`ポート${port}でリクエスト待受中...`);
});


// ルーティング
app.get('/', (req, res) => {
    res.render('home');
});


// ルーティングミドルウェアを使用
app.use('/', userRoutes);
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
