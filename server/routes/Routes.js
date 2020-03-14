const express = require('express');
const app = express.Router();
const repository = require('../repositories/PictureRepository');
const { authJwt } = require("../middlewares/Index");
const resizeOptimizeImages = require('resize-optimize-images');
const fs = require('fs');
const multer = require('multer');

// Set response headers
app.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

// Get Pictures
// Get all picture items in the db
app.get('/pictures', (req, res) => {
  repository.findByField(req.query).then((pictures) => {
    res.json(pictures);
  }).catch((error) => console.log(error));
});

// Add a picture item
app.post('/pictures', [authJwt.verifyToken], (req, res) => {

  // req.userId === null : means the token provided is different from the token saved on the server-side.
  if ( req.userId === null )
    res.send({ success : false });

  (async () => {
    let pictureId = 0;

    const mode = req.body.mode;

    // Increment pictureId if we are adding a picture
    if(mode === 'add'){
      await repository.getLastPicture().then((lastPicture) => {
        pictureId = Number(lastPicture[0].id) + 1;
      });
    } else {
      pictureId = req.body.id;
    }

    const id = pictureId;
    const title = req.body.title;
    const filename = req.body.filename.replace(/ /g,"_");
    const information = req.body.information;
    const size = req.body.size;
    const active = true;

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; // January is 0
    var yyyy = today.getFullYear();
    var h = today.getHours();
    var i = today.getMinutes();
    var s = today.getSeconds();

    if(dd<10) {
      dd = '0' + dd;
    }

    if(mm<10) {
      mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + i + ':' + s;

    const creation_date = today;

    if(mode === 'add'){
      await repository.create(id, title, filename, information, creation_date, size, active).then((picture) => {
        res.send({ success : true, file_id: id });
      }).catch((error) => console.log(error));
    }

    if(mode === 'edit'){
      await repository.updateById(id, {title: title, filename: filename, information: information, creation_date: creation_date, size: size, active: active}).then((picture) => {
        res.send({ success : true, file_id: id });
      }).catch((error) => console.log(error));
    }
  })();
});

// Delete a picture item
app.delete('/picture/:id', [authJwt.verifyToken], (req, res) => {
  if ( req.userId === null )
    res.send({ success : false });

  const { id } = req.params;

  repository.deleteByField({ id: id }).then((ok) => {
    res.send({ success : true, message: "Image supprimée" });
  }).catch((error) => console.log(error));

});

// Update a picture item
app.put('/picture/:id', (req, res) => {
  if ( req.userId === null )
    res.send({ success : false });

  const id = req.params.id;
  const picture = req.body;
  const message = "Image " + (req.body.active === true ? "activée" : "désactivée");

  repository.updateById(id, picture)
    .then(res.send({ success : true, message: message }))
    .catch((error) => console.log(error));
});

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

// Set the storage destination and filename of the uploaded pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
  let filename = file.originalname.replace(/ /g,"_");
    cb(null, filename)
  }
})

// Set up the multer module
const upload = multer({
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 5000000
  }
})

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

// Upload a picture
app.post('/upload', [authJwt.verifyToken], upload.single('file'), (req, res) => {

  const filename = req.file.filename.replace(/ /g,"_");

  // Copy the file to the thumbnails folder before resizing it
  fs.copyFile('./uploads/' + filename, './uploads/thumbnails/' + filename, (err) => {
    if (err) throw err;

    (async () => {
      // Set the options.
      const options = {
        images: ['./uploads/thumbnails/' + filename],
        width: 480,
        quality: 90
      };

      // Run the module that resizes the images
      await resizeOptimizeImages(options);
    })();
  });
  res.send({ success : true, message: "Image téléchargée" });
});

module.exports = app;
