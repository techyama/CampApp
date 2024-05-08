// モジュールのインポート
const express = require('express');
const router = express.Router();
const passport = require('passport');
// モデルのインポート
const User = require('../models/user');

// アカウント登録画面
router.get('/register', (req, res) => {
    res.render('users/register');
});

// アカウント登録
router.post('/register', async (req, res) => {
    try {
        // フォームデータを分割代入
        const { email, username, password } = req.body;
        // ユーザーインスタンスの作成
        const user = new User({ email, username });
        // パスワードをハッシュ化して登録
        await User.register(user, password);
        // 成功時フラッシュ表示
        req.flash('success', 'ようこそ！');
        // ホーム画面へリダイレクト
        res.redirect('/')
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
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), async (req, res) => {
    req.flash('success', 'ログインしました');
    // ホーム画面へリダイレクト
    res.redirect('/')
});

// ログアウト
router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if(err) { return nextTick(err); }
        req.flash('success', 'ログアウトしました');
        // ログイン画面へリダイレクト
        res.redirect('/login');
    });
});


// モジュールのエクスポート
module.exports = router;