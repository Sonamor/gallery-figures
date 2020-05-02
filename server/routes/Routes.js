const express = require('express');
const multer = require('multer');
const app = express.Router();
const authJwt = require("../middlewares/AuthJwt");
const authController = require("../controllers/Auth");
const pictureController = require("../controllers/Picture.js");

// Set response headers
app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Signin the app
app.post("/auth/signin", authController.signin);

// Get all picture items in the db
app.get('/pictures', pictureController.getAllPictures);

// Add a picture item
app.post('/pictures', [authJwt.verifyToken], pictureController.addPicture);

// Delete a picture item
app.delete('/picture/:id', [authJwt.verifyToken], pictureController.deletePicture);

// Update a picture item
app.put('/picture/:id', [authJwt.verifyToken], pictureController.updatePicture);

// Upload an image file
// Filters the images relatively to their mimetype
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if(!allowedTypes.includes(file.mimetype)){
    const error = new Error("Incorrect file");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false);
  }

  cb(null, true);
}

var storageS3 = multer.memoryStorage({
  destination: function(req, file, cb) {
    cb(null, '');
  },
  filename: function (req, file, cb) {
  let filename = file.originalname.replace(/ /g,"_");
    cb(null, filename)
  }
});

// Set up the multer module
const uploadS3 = multer({
  storage: storageS3,
  fileFilter,
  limits: {
    fileSize: 5000000
  }
})

app.post('/upload', [authJwt.verifyToken], uploadS3.single('file'), pictureController.uploadPictureS3);

// Sending back errors in case of wrong filetype or big file
app.use((err, req, res, next) => {
  if (err.code === "INCORRECT_FILETYPE"){
    res.status(422).json({ error: 'Only images are allowed'});
    return;
  }
  if (err.code === "LIMIT_FILE_SIZE"){
    res.status(422).json({ error: 'Allowed file size is 500KB'});
    return;
  }
})

module.exports = app;
