// モジュールの宣言
const { required } = require('joi');
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
userSchema.plugin(passportLocalMongoose);

// スキーマ定義のエクスポート
module.exports = mongoose.Model('User', userSchema);