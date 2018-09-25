/*jshint esversion: 6 */

const fs              = require('fs');

// Constants
const dbURL           = "mongodb://localhost:27017";

// Node.js and plugins
const http            = require('http');
const express         = require('express');
const app             = express();
const MongoClient     = require('mongodb').MongoClient;
const server          = http.createServer(app);
const path 			    = require('path');
const favicon 		  = require('serve-favicon');
const logger 		  = require('morgan');
const cookieParser 	  = require('cookie-parser');
const bodyParser 	  = require('body-parser');

// App functions and extensions
const index = require('./routes/index');
const users = require('./routes/users');

var db;

MongoClient.connect(dbURL, function(err, database) {
  if (err) throw err;
  db = database;
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
  req.mongodb = db;
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server.listen(9443, function () {
  console.log('Example app listening on port 9443!');
});
