const axios = require('axios');

const Comment = require('../models/Comment');
const User = require('../models/User');
const Story = require('../models/Story');

const TITLE_REGEX = /<title>(.*)<\/title>/i;

exports.voteStory = function upvote(req, res) {
  if (!req.session.user) {
    return res.status(401).send();
  }

  const direction = parseInt(req.query.direction);
  const userId = req.session.user._id;

  Story.findOne({ _id: req.params.storyId }).then(story => {
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
    res.status(400).send();
  });
};

exports.editComment = function editComment(req, res) {
  if (!req.session.user) {
    return res.status(401).send();
  }

  let status = 200;

  Comment.findById(req.params.commentId).then(comment => {
    if (!comment) {
      status = 404;
    } else if (comment.user != req.session.user._id) {
      status = 403;
    } else {
      comment.text = req.body.commentText;
    return comment.save();
    }
  }).then(saved => {
    res.status(status).send();
  }).catch(error => {
    res.status(500).json({ error: error.message }); 
  });;
};

exports.deleteComment = function deleteComment(req, res) {
  if (!req.session.user) {
    return res.status(401).send();
  }

  Comment.findById(req.params.commentId).then(comment => {
    if (!comment) {
      res.status(404).send();
    } else if (comment.user != req.session.user._id) {
      res.status(403).send();
    } else {
      let newCommentCount;

      Story.findById(comment.story).then(story => {
        story.comments = story.comments.filter(commentId => commentId != req.params.commentId);
        newCommentCount = story.comments.length;
        return story.save();
      }).then(() => {
        return comment.remove(); 
      }).then(() => {
        res.status(200).json({ comments: newCommentCount }); 
      }).catch(err => {
        res.status(500).json({ error: err.message });
      });
    }
  });
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
