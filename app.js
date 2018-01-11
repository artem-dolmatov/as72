var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var robots = require('express-robots-txt');
var passport = require('passport'); // vk
var VkStrategy = require('passport-vkontakte').Strategy; // vk

var db = require('./model/db');
var schools = require('./model/schools');

var index = require('./routes/index');
var admin = require('./routes/admin');
var schools = require('./routes/schools');

var VK_APP_ID = 6140767;
var VK_APP_SECRET = '8wqh2lEWleKHOFx3rL6S';

if (!VK_APP_ID || !VK_APP_SECRET) {
  throw new Error('Set VK_APP_ID and VK_APP_SECRET env vars to run the example');
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete VK profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new VkStrategy(
  {
    clientID: VK_APP_ID,
    clientSecret: VK_APP_SECRET,
    callbackURL: "http://as72.ru/auth/vk/callback",
    scope: ['email'],
    profileFields: ['email'],
  },
  function verify(accessToken, refreshToken, params, profile, done) {

    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's VK profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the VK account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/admin', admin);
app.use('/school', schools);
app.use(robots({ UserAgent: '*', Disallow: '/admin/',  CrawlDelay: '5' }))

// Авторизация в контакте
app.get('/school/:id', function (req, res) {
  res.render('school/show', { user: req.user });
});
app.get('/auth/vk',
  passport.authenticate('vkontakte'),
  function (req, res) {
    // The request will be redirected to VK for authentication, so this
    // function will not be called.
  });
app.get('/auth/vk/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('back');
  });
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/index2');
});
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
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

module.exports = app;
