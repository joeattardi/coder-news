const url = require('url');

const utils = require('../utils');
const Story = require('../models/Story');

exports.viewSubmitPage = function viewSubmitPage(req, res) {
  res.render('submit', { validationErrors: null });
};

exports.submitStory = function submitStory(req, res) {
  req.checkBody('title', 'Title is required.').notEmpty();
  req.checkBody('url', 'A valid URL is required.').notEmpty().isURL();

  const validationErrors = req.validationErrors();
  if (validationErrors) {
    const errorsByParam = utils.getErrorsByParam(validationErrors);
    return res.render('submit', { validationErrors: errorsByParam });
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
