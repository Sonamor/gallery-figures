// Config of MongoDB database and app port
module.exports = {
    DB: process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost:27017/gallery',
    APP_PORT: process.env.PORT ? process.env.PORT : 3000,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME ? process.env.S3_BUCKET_NAME : null,
    AWSAccessKeyId: process.env.AWSAccessKeyId ? process.env.AWSAccessKeyId : null,
    AWSSecretKey: process.env.AWSSecretKey ? process.env.AWSSecretKey : null,
    secret: process.env.SECRET ? process.env.SECRET : null,
  };
