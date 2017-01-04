const axios = require('axios');

const Comment = require('../models/Comment');
const User = require('../models/User');
const Story = require('../models/Story');

const TITLE_REGEX = /<title>(.*)<\/title>/i;

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
