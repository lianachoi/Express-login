var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var logger = require('morgan');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret code'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  resave: false, // 세션 변경 되지 않으면 세션 저장소에 값을 저장x
  saveUninitialized: true, // 세션 필요하지 않으면 세션 구동x
  secret: 'secret code',
  store: new fileStore(),
  cookie: {
      httpOnly: true,
      secure: false,
  },
})); // res에 세션 객체를 추가해줌

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

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
