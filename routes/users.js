// モジュールのインポート
const express = require('express');
const router = express.Router();
// モデルのインポート
const User = require('../models/user');

// アカウント登録画面
router.get('/register', (req, res) => {
    res.render('users/register');
});

// アカウント登録
router.post('/register',　async (req, res) => {
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


// モジュールのエクスポート
module.exports = router;