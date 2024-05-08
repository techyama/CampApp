// モジュールのインポート
const express = require('express');
const router = express.Router();
const passport = require('passport');
// モデルのインポート
const User = require('../models/user');
// 認証設定
const authOption = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true});

// アカウント登録画面
router.get('/register', (req, res) => {
    res.render('users/register');
});

// アカウント登録
router.post('/register', async (req, res, next) => {
    try {
        // フォームデータを分割代入
        const { email, username, password } = req.body;
        // ユーザーインスタンスの作成
        const user = new User({ email, username });
        // パスワードをハッシュ化して登録
        const registeredUser = await User.register(user, password);
        // ログイン
        req.login(registeredUser, err => {
            if (err) return next(err);
            // 成功時フラッシュ表示
            req.flash('success', 'ようこそ！');
            // ホーム画面へリダイレクト
            res.redirect('/')
        });
    } catch (e) {
        // エラー時フラッシュ表示
        req.flash('error', e.message);
        // アカウント登録画面へリダイレクト
        res.redirect('/register');
    }
});

// ログイン画面
router.get('/login', (req, res) => {
    res.render('users/login');
});

// ログイン
router.post('/login', authOption, async (req, res) => {
    req.flash('success', 'ログインしました');
    // セッションからログイン後の画面を取得しリダイレクト
    // 短絡評価でセッションが無ければホーム画面を表示
    console.log(req.session.returnTo);
    const redirectUrl = req.session.returnTo || '/';
    // セッション削除
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// ログアウト
router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        req.flash('success', 'ログアウトしました');
        // ログイン画面へリダイレクト
        res.redirect('/login');
    });
});


// モジュールのエクスポート
module.exports = router;