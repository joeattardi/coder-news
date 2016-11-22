const User = require('../models/User');

exports.viewSignUpPage = function viewSignUpPage(req, res) {
  res.render('signup');
};

exports.signup = function signup(req, res) {
  req.checkBody('username', 'Username is required.').notEmpty();
  req.checkBody('password', 'Password is required.').notEmpty();
  req.checkBody('confirmPassword', 'Passwords do not match.').equals(req.body.password);

  const validationErrors = req.validationErrors(true);
  if (validationErrors) {
    return res.render('signup', { validationErrors });
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user) {
      const validationErrors = {
        username: {
          msg: 'That username already exists.'
        }
      };
      return res.render('signup', { validationErrors });
    } else {
      const user = new User({
        username: req.body.username,
        password: req.body.password
      });

      user.save().then(document => {
        req.session.message = 'Signup complete. Welcome to Coder News!';
        req.session.user = user
        res.redirect('/');
      }).catch(error => {
        res.status(500).render('error', { error });
      });
    }
  });
}
