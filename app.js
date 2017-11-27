require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
var passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('cookie-session');

const index = require('./routes/index');

const app = express();

require('./passportInit')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req,res,next)=>{
  if(req.url=='/main.html'&&!getCookie(req.headers.cookie).id_token){
    return res.redirect('/');
  }
  next();
})
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:process.env.SECRET
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
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


let getCookie = (cookie)=>{
  let newc={};
  if(cookie){
    cookie = cookie.split(';');
    for(i in cookie){
      if(cookie[i]){
        cookie[i] = cookie[i].trim();
        cookie[i]=cookie[i].split('=');
        newc[cookie[i][0]] = cookie[i][1];
      }
    }
  }
  return newc;
}


module.exports = app;
