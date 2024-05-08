// モジュールのインポート
const express = require('express');
const router = express.Router();
const passport = require('passport');
// コントローラーのインポート
const users = require('../controllers/users');
// 認証設定
const authOption = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login', keepSessionInfo: true});


router.route('/register')
    // アカウント登録画面
    .get(users.renderRegister)
    // アカウント登録
    .post(users.register);


router.route('/login')
    // ログイン画面
    .get(users.renderLogin)
    // ログイン
    .post(authOption, users.login);


// ログアウト
router.get('/logout', users.logout);


// モジュールのエクスポート
module.exports = router;