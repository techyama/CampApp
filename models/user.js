// モジュールの宣言
const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

// スキーマ定義
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// ユーザー情報(ユーザー名やパスワード)やハッシュ等の情報が組み込まれる
// 第二引数にオプションを設定できる
userSchema.plugin(passportLocalMongoose, {
    // デフォルトで英語のメッセージを日本語で表現
    errorMessages: {
        UserExistsError: 'そのユーザー名はすでに使われています。',
        MissingPasswordError: 'パスワードを入力してください。',
        AttemptTooSoonError: 'アカウントがロックされてます。時間をあけて再度試してください。',
        TooManyAttemptsError: 'ログインの失敗が続いたため、アカウントをロックしました。',
        NoSaltValueStoredError: '認証ができませんでした。',
        IncorrectPasswordError: 'パスワードまたはユーザー名が間違っています。',
        IncorrectUsernameError: 'パスワードまたはユーザー名が間違っています。',
    }
});

// スキーマ定義のエクスポート
module.exports = mongoose.model('User', userSchema);