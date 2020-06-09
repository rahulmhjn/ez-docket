var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/products');
var wishListRouter = require('./routes/wishList');
var clientRouter = require('./routes/client/dashboard');

var app = express();

const session = require('express-session'),
      MongoStore = require('connect-mongo')(session),
      mongoose = require('mongoose'),
      passport = require('passport'),
      User = require('./models/user'),
      mongodb = require('./config/db.js'),
      methodOverride = require('method-override')
     const bodyParser = require('body-parser');


      mongodb();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(
  session({
    secret: 'Ecomhguygu',
    resave: false,
    signed: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 308 * 60 * 100000 }
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(async (req, res, next) => {
  res.locals.title = 'Backend';

  if(req.user){
    const user = await User.findById(req.user._id);
    const wishList = user.wishList;
    req.user.wishList = wishList;
  }
  

  res.locals.currentUser = req.user;
  console.log(req.user);

  res.locals.success = req.flash('success');
  delete req.session.success;

  res.locals.error = req.flash('error');
  delete req.session.error;

  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products',productRouter);
app.use('/wish-list', wishListRouter);
app.use('/client',clientRouter);

app.use('/', indexRouter);

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
