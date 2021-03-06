const createError = require('http-errors');
const express = require('express');
const path = require('path');
const passport = require('passport');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const secret = process.env.SECRET || 'bingowashisnameo';
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const bundleRouter = require('./routes/bundle');

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: secret,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.locals = {
    title: 'Martin Chat',
    message: req.flash('message'),
    user: req.user
  };
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/bundle', bundleRouter);

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
