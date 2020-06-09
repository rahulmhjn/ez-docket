const { validationResult } = require('express-validator');
User = require('../models/user'),


module.exports = {

    asyncErrorHandler(fn) {
        return (req, res, next) => {
          Promise.resolve(fn(req, res, next)).catch(next);
        };
      },

    checkInput(req, res, next) {
        if (req.body.password !== req.body.confirmPassword) {
          req.flash('error', 'Password and confirm password should match!!');
          return res.redirect('back');
        }
        return next();
      },

    setTypeAccess(req, res, next) {
        //to make user admin
        if (req.body.adminCode && req.body.adminCode === process.env.adminCode) {
          req.body.typeAccess = 'admin';
          return next();
        }
        if (req.body.businessType) {
          req.body.typeAccess = 'client';
          return next();
        }
        else {
          req.body.typeAccess = 'user';
          return next();
        }
      },

    async postRegister(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        if (req.body.password.length < 5) {
          req.flash('error', 'Length of password must be greater than 4');
          return res.redirect('back');
        }
    
        try {
          //logo upload
          
          const user = await User.register(new User(req.body), req.body.password);
          req.flash('success', 'Registered successfully');
          res.redirect('/users/login');
        } catch (err) {
          console.log(err.message);
          let error = err.message;
          if (
            error.includes(
              'E11000 duplicate key error index: ez.users.$username_1 dup key'
            )
          ) {
            error = 'a user with username already exists';
          }
          if (error.includes('number_1 dup key')) {
            error = 'A user with phone number already exists';
          }
          if (
            error.includes(
              'E11000 duplicate key error index: ez.users.$number_1 dup key'
            )
          ) {
            error = 'a user with this phone number already exists';
          }
    
          if (
            error.includes('A user with the given username is already registered')
          ) {
            error = 'a user with email already exists';
          }
    
          req.flash('error', error);
          res.redirect('back');
        }
      },


      async postLogin(req, res, next) {
        const { email, password } = req.body;
        var { user, error } = await User.authenticate()(email, password);
        if (error && !user) return next(error);
    
        req.login(user, function(err) {
          if (err) return next(error);
          var redirectUrl = '/';
          delete req.session.redirectTo;
    
          if (user.typeAccess === 'admin') {
            redirectUrl = '/adminDashboard/coupon';
          }
          if (user.typeAccess === 'client') {
            redirectUrl = '/client/showDashboard';
          }
          
          console.log(redirectUrl);
          req.flash('success', 'You are now logged in');
          return res.redirect(redirectUrl);
        });
      },
      getLogout(req, res, next) {
        req.logout();
        req.flash('success', 'You are now logged out');
        res.redirect('/');
      },

      isLoggedIn(req, res, next) {
        if (req.isAuthenticated() ) return next();
  
        req.flash('error', 'You need to log in first !!');
        req.session.redirectTo = req.originalUrl;
        return res.redirect('/users/login');
      },

      isAdmin: async (req, res, next) => {
        if (req.user.typeAccess === 'admin') {
          return next();
        }
        req.flash('error', 'you are not admin');
        return res.redirect('/');
      },

      isClient: async (req, res, next) => {
        
        if (req.user.typeAccess == 'client' || req.user.typeAccess === 'admin') {
          return next();
        }
        req.flash('error', 'you can not do add opertions');
        return res.redirect('/');
      },

      async redirectMer(req, res, next) {
        if (req.user) {
          
          if (req.user.typeAccess == 'client') {
            return res.redirect('/client/showDashboard');
          }
        }
    
        return next();
      }
    

}