var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var logger = require('morgan');
// passport 사용
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


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

app.use(passport.initialize());
app.use(passport.session());

/* 테스트용 아이디 패스워드 */
var authData = {
  username: 'aaa',
  password: 'bbb',
  nickname: 'ccc'
}

// 로그인 시 세션 처리 콜백 코드
passport.serializeUser(function(user, done) {
  console.log('serializer', user);
  done(null, user);
});
// 화면 이동 시 세션 처리
passport.deserializeUser(function(id, done) {
  console.log('deserializer', id);
  // User.findById(id, function(err, user) {
  // 아래의 id 값을 key로 db에서 조회해오면 됨.
  done(null, id);
  // });
});

// 인증처리 하는 부분(콜백함수)
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('callback', username,password);
    if (username === authData.username) {
      if (password === authData.password) {
        return done(null, authData);
      } else {
        return done(null, false, { message: 'Incorrect password.' });
      }
    } else {
      return done(null, false, { message: 'Incorrect username.' });
    }
  }
));

// 세션을 내부적으로 사용하기 때문에 아래쪽에 passport 코드 작성할것
app.post('/auth/login_process',
  passport.authenticate('local', {// 로그인전략 방식 local로 사용
    //successRedirect: '/',
    failureRedirect: '/auth/login'}),
  function(req, res){
    req.session.save( function() {
      res.redirect('/');    
    })}
  );

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
