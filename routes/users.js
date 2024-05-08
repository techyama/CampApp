// モジュールのインポート
const express = require('express');
const router = express.Router();
const passport = require('passport');
// コントローラーのインポート
const users = require('../controllers/users');
// 認証設定
const authOption = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true});

// アカウント登録画面
router.get('/register', users.renderRegister);

// アカウント登録
router.post('/register', users.register);

// ログイン画面
router.get('/login', users.renderLogin);

// ログイン
router.post('/login', authOption, users.login);

// ログアウト
router.get('/logout', users.logout);


// モジュールのエクスポート
module.exports = router;