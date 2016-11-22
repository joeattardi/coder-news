const axios = require('axios');

const User = require('../models/User');

const TITLE_REGEX = /<title>(.*)<\/title>/;

exports.usernameExists = function usernameExists(req, res) {
  User.findOne({ username: req.query.username }).then(user => {
    if (user) {
      res.json({ exists: true });
    } else
      res.json({ exists: false });
  }).catch(error => {
    res.status(500).json({ error: error.message });
  }); 
}

exports.extractTitle = function extractTitle(req, res) {
  axios.get(req.query.url).then(result => {
    const matcher = TITLE_REGEX.exec(result.data);
    if (matcher) {
      res.json({
        title: matcher[1]
      });
    } else {
      res.status(401).json({
        error: 'No title found'
      });
    }
  }).catch(err => {
    res.status(500).json({
      error: err.message
    }); 
  });
};
