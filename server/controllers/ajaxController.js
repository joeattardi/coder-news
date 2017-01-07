const axios = require('axios');

const Comment = require('../models/Comment');
const User = require('../models/User');
const Story = require('../models/Story');

const TITLE_REGEX = /<title.*>([\s\S]*)<\/title>/i;

function vote(cls, id, direction, userId, res) {
  // prevent multiple votes
  if (direction > 1) {
    direction = 1;
  } else if (direction < -1) {
    direction = -1;
  }

  cls.findById(id).then(item => {
    const voterProperty = direction > 0 ? 'upvoters' : 'downvoters';
    const otherVoterProperty = direction > 0 ? 'downvoters' : 'upvoters';

    const index = item[voterProperty].indexOf(userId);
    if (index < 0) {
      item[voterProperty].push(userId);
      item.votes += direction;
    } else { 
      item.votes -= direction;
      item[voterProperty].splice(index, 1);
    }

    const otherIndex = item[otherVoterProperty].indexOf(userId);
    if (otherIndex >= 0) {
      item[otherVoterProperty].splice(otherIndex, 1);
      item.votes -= -direction;
    }

    return item.save();
  }).then(savedItem => {
    res.status(200).json({ votes: savedItem.votes }); 
  }).catch(error => {
    res.status(500).send({ error: error.message }); 
  }); 
}

exports.voteComment = function voteComment(req, res) {
  if (!req.session.user) {
    return res.status(401).send();
  }

  const direction = parseInt(req.query.direction);
  const userId = req.session.user._id;

  vote(Comment, req.params.commentId, direction, userId, res);
};

exports.voteStory = function voteStory(req, res) {
  if (!req.session.user) {
    return res.status(401).send();
  }

  const direction = parseInt(req.query.direction);
  const userId = req.session.user._id;

  vote(Story, req.params.storyId, direction, userId, res);
};

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
        title: matcher[1].trim()
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
