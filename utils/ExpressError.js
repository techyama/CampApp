// 例外クラスの定義
class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

// エクスポート
module.exports = ExpressError;