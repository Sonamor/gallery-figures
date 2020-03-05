const createError = require('http-errors');
const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const config = require('./config/Config');

const routes = require('./routes/Routes');

const app = express();

mongoose.connect(config.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors({credentials: true, origin: 'http://localhost:8080',
enablePreflight: true}));  //enable cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
  "Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
  });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(history({
  verbose: true
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(session({
  cookieName: 'session',
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {
      secure: false
  }
}));

app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/User');
var bcrypt = require('bcrypt');


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
        username: username
      }, async function(err, user) {

        // Bug
        if (err) {
          return done(err);
        }

        // user does not exist
        if (!user) {
          return done(null, false);
        }

        const match = bcrypt.compareSync(password, user.password);

        // Incorrect password
        if (match === false) {
          return done(null, false);
        }

        // Correct password
        return done(null, user);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {
  // NOTE: second true param is making 'hack'
  // so the session will be saved after a page refresh, but it will be destroyed after a server refresh
  done(null, true);
});
/*passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());*/

app.use('/api', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(config.APP_PORT); // Listen on port defined in environment


module.exports = app;
