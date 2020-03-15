
const pictureRepository = require('../repositories/PictureRepository');
const resizeOptimizeImages = require('resize-optimize-images');
const fs = require('fs');

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
