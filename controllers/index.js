module.exports = {
  index: function (req, res) {
    res.render('index');
  },
  login: function (req, res) {
    res.render('login');
  },
  signUp: function (req, res) {
    res.render('newUser');
  }
};
