// 非同期処理中にエラーをcatchした時errorオブジェクトをnextに渡すラッパー関数
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(e => next(e));
    }
}