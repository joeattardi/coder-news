const url = require('url');

const Story = require('../models/Story');

exports.viewSubmitPage = function viewSubmitPage(req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('submit', { validationErrors: null, user: req.session.user });
};

exports.submitStory = function submitStory(req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  req.checkBody('title', 'Title is required.').notEmpty();
  req.checkBody('url', 'A valid URL is required.').notEmpty().isURL();

  const validationErrors = req.validationErrors(true);
  if (validationErrors) {
    return res.render('submit', { validationErrors });
  }

  const story = new Story({
    title: req.body.title,
    url: req.body.url,
    domain: url.parse(req.body.url).hostname,
    submitted: new Date()
  });

  story.save().then(document => {
    res.redirect('/');
  }).catch(error => {
      res.status(500).render('error', { error });
  });
};
