const url = require('url');
const markdown = require('markdown').markdown;

const Story = require('../models/Story');
const Comment = require('../models/Comment');
const scoreUpdater = require('../score-updater');

exports.viewSubmitPage = function viewSubmitPage(req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  res.render('submit', { validationErrors: null, user: req.session.user });
};

exports.viewStory = function viewStory(req, res) {
  Story.findById(req.params.storyId)
    .populate('submitter')
    .populate({
      path: 'comments',
      model: 'Comment',
      populate: {
        path: 'user'
      }
    })
    .then(story => {
      if (story) {
        res.render('story', { story, markdown, user: req.session.user });
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

exports.postComment = function postComment(req, res) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  Story.findById(req.params.storyId).then(story => {
    if (story) {
      const comment = new Comment({
        posted: new Date(),
        story,
        text: req.body.text,
        user: req.session.user,
        votes: 1,
        upvoters: [
          req.session.user
        ]
      }); 

      comment.save().then(document => {
        story.comments.push(comment);
        return story.save();
      }).then(document => {
        res.redirect(`/story/${req.params.storyId}`);
      }).catch(error => {
        res.status(500).render('error', { error }); 
      });
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

  scoreUpdater.updateScore(story);

  story.save().then(document => {
    res.redirect('/');
  }).catch(error => {
      res.status(500).render('error', { error });
  });
};
