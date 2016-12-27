const axios = require('axios');

const User = require('../models/User');
const Story = require('../models/Story');

const TITLE_REGEX = /<title>(.*)<\/title>/i;

exports.vote = function upvote(req, res) {
  if (!req.session.user) {
    return res.status(401).send();
  }

  const direction = parseInt(req.query.direction);
  const userId = req.session.user._id;

  Story.findOne({ _id: req.query._id }).then(story => {
    const voterProperty = direction > 0 ? 'upvoters' : 'downvoters';
    const otherVoterProperty = direction > 0 ? 'downvoters' : 'upvoters';

    const index = story[voterProperty].indexOf(userId);
    if (index < 0) {
      story[voterProperty].push(req.session.user._id);
      story.votes += direction;
    } else {
      story.votes -= direction;
      story[voterProperty].splice(index, 1);
    }

    const otherIndex = story[otherVoterProperty].indexOf(userId);
    if (otherIndex >= 0) {
      story[otherVoterProperty].splice(otherIndex, 1);
      story.votes -= -direction;
    }

    return story.save();
  }).then(savedStory => {
    res.status(200).json({ votes: savedStory.votes });
  }).catch(error => {
    console.log(error);
    res.status(400).send();
  });
}

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
  axios.get(req.query.url, {
    headers: { 'Accept': 'text/html' }
  }).then(result => {
    const matcher = TITLE_REGEX.exec(result.data);
    if (matcher) {
      res.json({
        title: matcher[1]
      });
    } else {
      res.status(400).json({
        error: 'No title found'
      });
    }
  }).catch(err => {
    res.status(500).json({
      error: err.message
    }); 
  });
};
