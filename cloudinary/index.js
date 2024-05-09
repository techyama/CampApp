// モジュールにインポート
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinaryコンフィグ設定
cloudinary.config({
   cloud_name: process.env.CLOUDINALY_CLOUD_NAME,
   api_key: process.env.CLOUDINALY_KEY,
   api_secret: process.env.CLOUDINALY_SECRET
});

// cloudinaryStorage設定
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'CampApp',
      allowed_formats: ['jpeg', 'jpg', 'png'],
    },
  });

// モジュールのエクスポート
  module.exports = {
    cloudinary,
    storage
  }