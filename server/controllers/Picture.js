
const pictureRepository = require('../repositories/PictureRepository');
const resizeOptimizeImages = require('resize-optimize-images');
const config = require('../config/Config');
const fs = require('fs');
const sharp = require("sharp");
const aws = require('aws-sdk');

aws.config.region = 'eu-west-3';

// Fetch all the pictures relatively to the condition
exports.getAllPictures = (req, res) => {
  pictureRepository.findByField(req.query).then((pictures) => {

    if (!pictures) {
      return res.status(404).send({ message: "Aucune picture trouvée" });
    }

    // Send the pictures back to the front
    res.status(200).json(pictures);
  });
};

// Add a new picture in database
exports.addPicture = (req, res) => {

  // req.userId === null : means the token provided is different from the token saved on the server-side.
  if ( req.userId === null )
    res.status(403).send({ message: "Non autorisé" });

  (async () => {
    let pictureId = 0;

    const mode = req.body.mode;

    // Increment pictureId if we are adding a picture
    if(mode === 'add'){
      await pictureRepository.getLastPicture().then((lastPicture) => {
        if(lastPicture.length <= 0){
          pictureId = 0;
        } else {
          pictureId = Number(lastPicture[0].id) + 1;
        }
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

    if(dd < 10) {
      dd = '0' + dd;
    }

    if(mm < 10) {
      mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + i + ':' + s;

    const creation_date = today;

    if(mode === 'add'){
      await pictureRepository.create(id, title, filename, information, creation_date, size, active).then((picture) => {

        if (!picture) {
          res.status(500).send({ message: "Impossible de sauvegarder le post" });
          return;
        }

        res.status(200).send({ message: "Image sauvegardée", file_id: id });
      });
    }

    if(mode === 'edit'){
      await pictureRepository.updateById(id, {title: title, filename: filename, information: information, creation_date: creation_date, size: size, active: active}).then((picture) => {
        res.status(200).send({ message: "Modifications sauvegardées", file_id: id });
      });
    }
  })();
};

// Delete a picture in database
exports.deletePicture = (req, res) => {
  if ( req.userId === null )
    res.status(403).send({ message: "Non autorisé" });

  const { id } = req.params;

  pictureRepository.deleteByField({ id: id }).then((picture) => {
    res.status(200).send({ message: "Image supprimée" });
  });
};

// Update a picture in database
exports.updatePicture = (req, res) => {
  if ( req.userId === null )
    res.status(403).send({ message: "Non autorisé" });

  const id = req.params.id;
  const picture = req.body;
  const message = "Image " + (req.body.active === true ? "activée" : "désactivée");

  pictureRepository.updateById(id, picture).then((picture) => {
    res.status(200).send({ message: message })
  });
};

// Upload picture in upload directory
exports.uploadPicture = (req, res) => {
  if ( req.userId === null )
    res.status(403).send({ message: "Non autorisé" });

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
  res.status(200).send({ message: "Image téléchargée" });
};

// Upload picture on S3 bucket
exports.uploadPictureS3 = (req, res) => {

  const S3_BUCKET_NAME = config.S3_BUCKET_NAME;

  if ( req.userId === null )
    res.status(403).send({ message: "Non autorisé" });

  const file = req.file;

  // To connect to S3
  let s3bucket = new aws.S3({
    Bucket: S3_BUCKET_NAME,
    accessKeyId: config.AWSAccessKeyId,
    secretAccessKey: config.AWSSecretKey
  });

  // Parameters of the file to upload
  var params = {
    Bucket: S3_BUCKET_NAME,
    Key: 'pictures/' + file.originalname.replace(/ /g,"_"),
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  // Upload on S3
  s3bucket.upload(params, function (err, data) {
    if (err)
      res.status(500).send({ message: "Erreur lors de la sauvegarde de l'image" });
  });


  // Making a thumbnail copy of the picture to make it smaller and upload it somewhere else on S3
  sharp(file.buffer)
    .resize({ width: 480 })
    .jpeg({ quality: 90 })
    .toBuffer()
    .then(dataThumbnail => {
      var params_thumbnails = {
        Bucket: S3_BUCKET_NAME,
        Key: 'pictures/thumbnails/' + file.originalname.replace(/ /g,"_"),
        Body: dataThumbnail,
        ContentType: file.mimetype,
        ACL: 'public-read'
      };

      s3bucket.upload(params_thumbnails, function (err, data) {
        if (err)
          res.status(500).send({ message: "Erreur lors de la sauvegarde de l'image" });
      });
    })
    .catch(err => { res.status(500).send({ message: "Erreur lors de la sauvegarde de l'image" }); });
  res.status(200).send({ message: "Image sauvegardée" });
};
