var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');

var client = require('./routes/client'); 
var user = require('./routes/user'); 
var mqttsec = require('./routes/mqtt-security'); 
var charts = require('./routes/charts'); 

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(express.json({ limit: '10mb' }));
//app.use(express.urlencoded({ extended: true, limit: '10mb'  }));

// app.use(bodyParser.json({ limit: '10mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());
app.use(express.static('public'));

app.use(function(req, res, next) {
  console.log("method " + req.headers.origin);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers","Origin, Content-Type,Content-Length, Authorization, Accept,X-Requested-With, x-access-token, userid");
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  } else {
    return next();
  }
});

app.use('/client', client);
app.use('/user', user);
app.use('/mqttsec', mqttsec);
app.use('/charts', charts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
