const bcrypt = require('bcryptjs');

const User = require('../models/User');

exports.viewSignUpPage = function viewSignUpPage(req, res) {
  res.render('signup');
};

exports.logout = function logout(req, res) {
  delete req.session.user;
  req.session.message = 'You have been logged out.';
  res.redirect('/');
};

exports.viewLoginPage = function viewLoginPage(req, res) {
  res.render('login');
};

exports.login = function login(req, res) {
  req.checkBody('username', 'Username is required.').notEmpty();
  req.checkBody('password', 'Password is required.').notEmpty();

  const validationErrors = req.validationErrors(true);
  if (validationErrors) {
    return res.render('login', { validationErrors });
  }

  User.findOne({ username: req.body.username }).then(user => {
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user = {
        _id: user._id,
        username: user.username 
      };
      req.session.message = 'You have successfully logged in.';
      res.redirect('/');
    } else {
      res.render('login', { loginError: 'Invalid username or password.' });
    }
  }).catch(error => {
    res.status(500).render('error', { error });
  });
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
