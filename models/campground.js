// モジュールの宣言
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// スキーマ定義
const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

// スキーマ定義のエクスポート
module.exports = mongoose.model('Campground', campgroundSchema);
