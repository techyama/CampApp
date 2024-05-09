// モジュールのインポート
const mongoose = require('mongoose');
// seeds(ダミーデータ)のインポート
const cities = require('../seeds/cities');
const { descriptors, places } = require('../seeds/seedHelpers');
// モデルのインポート
const Campground = require('../models/campground');

// 接続が成功したか否か確認
mongoose.connect('mongodb://localhost:27017/campApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('接続に成功しました！！');
})
.catch((err) => {
    console.log('接続エラー！！');
    console.log(err);
});

// 引数で受け取った配列からランダムな要素を取り出す関数
const randomValue = array => array[Math.floor(Math.random() * array.length)];

// seedsから50個データを挿入する関数
const seedDB = async () => {
    // 挿入前に全データ削除
    await Campground.deleteMany({});
    for (let i= 0; i < 50; i++) {
        // ランダムなインデックスを振る
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        // 1000～3000までのランダムな数値を振る
        const price = Math.floor(Math.random() * 2000) + 1000;
        // データを挿入用に加工してインスタンスに代入
        const camp = new Campground({
            author: '663b1cd10165177cd4357473',
            location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title: `${randomValue(descriptors)}・${randomValue(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dyajtx6xu/image/upload/v1715232944/CampApp/aqhjtklcidnecbdfoiqd.jpg',
                    filename: 'CampApp/aqhjtklcidnecbdfoiqd'
                },
                {
                    url: 'https://res.cloudinary.com/dyajtx6xu/image/upload/v1715232944/CampApp/ktsootpr0veq08vyxh08.jpg',
                    filename: 'CampApp/ktsootpr0veq08vyxh08'
                }
            ],
            description: '木曾路はすべて山の中である。あるところは岨づたいに行く崖の道であり、あるところは数十間の深さに臨む木曾川の岸であり、あるところは山の尾をめぐる谷の入り口である。一筋の街道はこの深い森林地帯を貫いていた。東ざかいの桜沢から、西の十曲峠まで、木曾十一宿はこの街道に添うて、二十二里余にわたる長い谿谷の間に散在していた。道路の位置も幾たびか改まったもので、古道はいつのまにか深い山間に埋もれた。',
            price
        });
        await camp.save();
    }
};

// データ挿入後、DB接続をクローズ
seedDB().then(() => {
    mongoose.connection.close();
});
