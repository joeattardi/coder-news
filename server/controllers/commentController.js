const fs = require('fs');
const path = require('path');

const ejs = require('ejs');
const markdown = require('markdown').markdown;

const Comment = require('../models/Comment');
const Story = require('../models/Story');

exports.replyToComment = function replyToComment(req, res) {
  if (!req.session.user) {
    return res.status(401).send();
  };

  Comment.findById(req.params.commentId).then(parentComment => {
    if (!parentComment) {
      res.status(404).send();
    } else {
      const reply = new Comment({
        parent: parentComment,
        posted: new Date(),
        story: parentComment.story,
        text: req.body.commentText,
        user: req.session.user,
        votes: 1,
        upvoters: [
          req.session.user 
        ]
      });

      let newCommentCount;

      reply.save().then(savedReply => {
        parentComment.children.push(savedReply);
        return parentComment.save();
      }).then(savedParent => {
        return Story.findById(reply.story);
      }).then(story => {
        newCommentCount = story.commentCount += 1;
        return story.save();
      }).then(() => {
        return reply.populate('user').execPopulate();
      }).then(() => {
        const template = fs.readFileSync(path.join(__dirname, '../views/partials/comment.ejs'), { encoding: 'utf-8' });
        markup = ejs.render(template, { 
          user: req.session.user,
          comment: reply,
          markdown: markdown
        });
        res.status(200).json({ markup, comments: newCommentCount });
      }).catch(error => {
        res.status(500).json({ error: error.message }); 
      }); 
    }
  }).catch(error => {
    res.status(500).json({ error: error.message });
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
    } else if (!comment.user.equals(req.session.user._id)) {
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
    } else if (!comment.user.equals(req.session.user._id)) {
      res.status(403).send();
    } else {
      comment.remove().then(removedComment => {
        res.status(200).send();
      }).catch(err => {
        res.status(500).json({ error: err.message }); 
      });
    }
  });
};

