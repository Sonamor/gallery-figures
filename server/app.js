const createError = require('http-errors');
const express = require('express');
const app = express();
const history = require('connect-history-api-fallback');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const flash = require('connect-flash');
const bodyParser = require("body-parser");

const config = require('./config/Config');
const routes = require('./routes/Routes');

// Connect to database
mongoose.connect(config.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({credentials: true, enablePreflight: true}));  //enable cors
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(history({
  verbose: true
}))
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// Use the routes and add prefix api
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
