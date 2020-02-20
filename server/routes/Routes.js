const express = require('express');

const app = express.Router();
const repository = require('../repositories/PictureRepository');

var passport = require('passport');
var User = require('../models/User');

app.get('/', function (req, res) {
  res.render('index', { user : req.user });
});

app.get('/login', function(req, res) {
  if ( req.session.passport.user != null ) {
    res.redirect('/');
  } else {
    res.render('login', {
      user : req.user,
      title : 'Sign-in',
      subTitle : 'Come back please !'
    });
  }
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {

    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send({ success : false, message : 'Mot de passe incorrect' });
    }
    // ***********************************************************************
    // "Note that when using a custom callback, it becomes the application's
    // responsibility to establish a session (by calling req.login()) and send
    // a response."
    // Source: http://passportjs.org/docs
    // ***********************************************************************
    req.login(user, loginErr => {
      if (loginErr) {
        return next(loginErr);
      }
      req.session.save(function(){
        return res.send({ success : true, message : 'Bienvenue ' + user.username });
      });
    });
  })(req, res, next);
});

const authMiddleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.send({ success : false });
  } else {
    return next()
  }
}

app.get("/user", authMiddleware, (req, res) => {
  let user = User.findOne({
    username: req.session.passport.user
  });

  var returnStatus = { success : false };
  if (user !== null) {
    returnStatus = { success : true, user: req.session.passport.user };
  }
console.log(returnStatus);
  res.send(returnStatus);
})

app.get('/logout', function(req, res) {
  if ( req.session.passport.user != null ) {
    req.logout();
    res.send({ success : true });
  }
  else {
    res.send({ success : false });
  }
});

app.get('/sessionStatus', function(req, res) {
  res.send({ success : true, user: {_id: '5e402361d4c79b29242b842b', username: 'Romanos', password: '$2b$10$sGSaxYRvARjd/LJlzMyyvex42PhlmSX/8NK4QFnEXWUOlqowhDTl.'}});
});




// Get Picutres
// get all picture items in the db
app.get('/pictures', (req, res) => {
  repository.findAll().then((pictures) => {
    res.json(pictures);
  }).catch((error) => console.log(error));
});

// add a picture item
app.post('/pictures', (req, res) => {
  const id = '12';
  const title = req.body.title;
  const filename = req.body.filename;
  const information = req.body.information;
  const size = req.body.size;
  const active = true;

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var h = today.getHours();
  var i = today.getMinutes();
  var s = today.getSeconds();

  if(dd<10) {
      dd = '0'+dd
  }

  if(mm<10) {
      mm = '0'+mm
  }

  today = yyyy + '-' + mm + '-' + dd + ' ' + h + ':' + i + ':' + s;

  const creation_date = today;

  repository.create(id, title, filename, information, creation_date, size, active).then((picture) => {
    res.send({ success : true, message: "Image Ajoutée" });
  }).catch((error) => console.log(error));
});

// delete a picture item
app.delete('/picture/:id', (req, res) => {
  if ( req.session.passport.user != null ) {
    const { id } = req.params;
    repository.deleteByField({id: id}).then((ok) => {
      res.send({ success : true, message: "Image supprimée" });
    }).catch((error) => console.log(error));
  } else {
    res.send({ success : false });
  }
});

// update a picture item
app.put('/picture/:id', (req, res) => {
  if ( req.session.passport.user != null ) {
    const id = req.params.id;
    const picture = req.body;
    const message = "Image " + (req.body.active === true ? "activée" : "désactivée");

    repository.updateById(id, picture)
      .then(res.send({ success : true, message: message }))
      .catch((error) => console.log(error));
  } else {
    res.send({ success : false });
  }
});
const fileFilter = (req, file, cb) =>{
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if(!allowedTypes.includes(file.mimetype)){
    const error = new Error("Incorrect file");
    error.code = "INCORRECT_FILETYPE";

    return cb(error, false);
  }

  cb(null, true);
}
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    let filename = file.originalname;
    cb(null, filename)
  }
})
const upload = multer({
  //dest: './uploads',
  storage: storage,
  fileFilter,
  limits: {
    fileSize: 5000000
  }
})

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
// update a picture item
app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  res.json({ file: req.file });
});
module.exports = app;
