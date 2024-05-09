// モジュールの宣言
const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

// スキーマ定義
const campgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    // 投稿ユーザーをリレーション
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    // reviewスキーマのリレーション
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// キャンプデータ削除をトリガーとするミドルウェア定義
campgroundSchema.post('findOneAndDelete', async function(doc) {
    // 削除するキャンプデータのIDが含まれていたら削除
    if (doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

// スキーマ定義のエクスポート
module.exports = mongoose.model('Campground', campgroundSchema);
