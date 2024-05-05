// モジュールの宣言
const mongoose = require('mongoose');
const { Schema } = mongoose;

// スキーマ定義
const reviewSchema = new Schema({
    body: String,
    rating: Number
});

// スキーマ定義のエクスポート
module.exports = mongoose.model('Review', reviewSchema);