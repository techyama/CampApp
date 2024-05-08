// ログイン済みじゃなければログインを促すミドルウェア
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // 遷移に失敗した画面のURLをセッションに保存
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'ログインしてください');
        return res.redirect('/login');
    }
    next();
};