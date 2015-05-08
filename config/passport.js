var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User          = require('../models/user');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

var localStrategy = new LocalStrategy(function (username, password, done) {

  User.findOne({username: username}, function (err, user) {
    if(err) return done(err);
    if(!user) return done(null, false);

    user.comparePassword(password, function (err, isMatch) {
      if(err) return done(err);
      return isMatch ? done(err, user) : done(null, false);
    });
  });
});
passport.use(localStrategy);

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
  }
};
