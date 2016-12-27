const url = require('url');

const Story = require('../models/Story');

exports.viewSubmitPage = function viewSubmitPage(req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('submit', { validationErrors: null, user: req.session.user });
};

exports.viewStory = function viewStory(req, res) {
  Story.findById(req.params.storyId).populate('submitter').then(story => {
    if (story) {
      res.render('story', { story, user: req.session.user });
    } else {
      res.status(404).render('notFound');
    }
  }).catch(err => {
    if (err.name === 'CastError') {
      res.status(404).render('notFound');
    } else {
      res.status(500).render('error', { error: err });
    }
  });
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
    submitted: new Date(),
    submitter: req.session.user,
    votes: 1,
    upvoters: [
      req.session.user
    ]
  });

  story.save().then(document => {
    res.redirect('/');
  }).catch(error => {
      res.status(500).render('error', { error });
  });
};
