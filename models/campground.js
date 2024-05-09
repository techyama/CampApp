// モジュールの宣言
const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

// スキーマ定義
const imageSchema = new Schema({
    url: String,
    filename: String
});
// バーチャル定義なのでmongoDBに登録する必要のないプロパティ
imageSchema.virtual('thumbnail').get(function() {
    // cloudinaryとwidth200で画像のやり取りをする
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
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
