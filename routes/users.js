var express = require('express');
var router = express.Router();
var passport = require('passport');


const {postRegister,
       setTypeAccess,
      checkInput,
    postLogin,
  asyncErrorHandler,
  redirectMer,
getLogout} = require('../controllers/auth'),

       { check } = require('express-validator');

       var FacebookStrategy = require('passport-facebook').Strategy;
       var GoogleStrategy = require('passport-google-oauth').OAuthStrategy;
       var User = require('../models/user');
       
       var configAuth = require('../config');

       // Facebook oauth
       
       
      //  passport.use(new FacebookStrategy({
      //      clientID: configAuth.facebookAuth.clientId,
      //      clientSecret: configAuth.facebookAuth.clientSecret,
      //      callbackURL: configAuth.facebookAuth.callbackURL
      //    },
      //    function(accessToken, refreshToken, profile, done) {
      //      User.findOne({facebookId: profile.id}, function(err, user) {
      //        if (err) { return done(err); }
      //        if(!err && user!= null){
      //          done(null, user);
      //        }
       
      //        else{
      //         user = new User({username: profile.displayName});
      //         // console.log(profile);
      //         user.facebookId = profile.id;
      //          user.save((err,user) => {
      //            if(err) {
      //                return done(err, false);
      //            }
      //            else {
      //                return done(null, user);
      //            }
      //        });
      //        }
      //      });
      //    }
      //  ));

       // Google Oauth

    //    passport.use(new GoogleStrategy({
    //     consumerKey: GOOGLE_CONSUMER_KEY,
    //     consumerSecret: GOOGLE_CONSUMER_SECRET,
    //     callbackURL: "http://localhost:3000/users/auth/google/callback"
    //   },
    //   function(token, tokenSecret, profile, done) {
    //       User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //         return done(err, user);
    //       });
    //   }
    // ));
       

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post(
  '/register/user',
  [
    setTypeAccess,
    check('username', 'username is required !!').exists(),
    check('email', 'Enter valid email').isEmail(),
    check('number', 'mobile number is required').exists(),
    
    checkInput
  ],
  asyncErrorHandler(postRegister)
);

router.post(
  '/register/client',
  [
    setTypeAccess,
    check('username', 'username is required !!').exists(),
    check('email', 'Enter valid email').isEmail(),
    check('number', 'mobile number is required').exists(),
    check('businessType', 'business type is required').exists(),
    checkInput
  ],
  asyncErrorHandler(postRegister)
);

router.get('/login',redirectMer,function(req,res,next){
  res.render('login');
})

router.post(
  '/login',
  [check('email', 'Enter valid email').isEmail()],
  asyncErrorHandler(postLogin)
);

router.get('/auth/facebook', passport.authenticate('facebook',{scope: ['email']}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/users/login' }));


router.get('/register/client',function(req, res, next){
  res.render('client/register');
})

router.get('/logout', getLogout);

module.exports = router;
