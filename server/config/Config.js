// Config of MongoDB database and app port
module.exports = {
    DB: process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost:27017/gallery',
    APP_PORT: process.env.PORT ? process.env.PORT : 3000,
    secret: "RomSecret"
  };
