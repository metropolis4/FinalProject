var passport = require('passport'),
    User     = require('../models/user');

var loginHelpers = {
  performLogin: function (req, res, next, user) {
    req.login(user, function (err) {
      if(err) return next(err);
      return res.redirect('/main');
    });
  },
  performNewUser: function (req, res, next, user) {
    req.login(user, function (err) {
      if(err) return next(err);
      return res.redirect('/login');
    });
  }
};

var authenticationController = {
  login: function (req, res) {
    res.render('login', {
      error: req.flash('error')
    });
  },
  processLogin: function (req, res, next) {
    var authFunction = passport.authenticate('local', function (err, user, info) {
      if(err) return next(err);
      if(!user) {
        req.flash('error', 'Login Error. Please Try Again');
        return res.redirect('/login');
      }
      loginHelpers.performLogin(req, res, next, user);
    });
    authFunction(req, res, next);
  },
  processSignup: function (req, res, next) {
    var user = new User({
      username: req.body.username,
      password: req.body.password,
      email   : req.body.email
    });
    user.save(function (err, user) {
      if(err){
        var errorMessage = "Error, Please Try Again";
        if(err.code === 11000){
          errorMessage = "User Already Exists.";
        }
        req.flash('error', errorMessage);
        return res.redirect('/signup');
      }
      loginHelpers.performNewUser(req, res, next, user);
    });
  },
  logout: function (req, res) {
    req.logout();
    res.redirect('/login');
  }
};

module.exports = authenticationController;
