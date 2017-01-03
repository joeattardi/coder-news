const mongoose = require('mongoose');
const moment = require('moment');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story',
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  upvoters: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  downvoters: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  score: {
    type: Number,
    default: 0
  },
  posted: Date,
  children: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Comment'
  }
});

commentSchema.methods.relativePosted = function relativePosted() {
  return moment(this.posted).fromNow(); 
};

commentSchema.methods.isUpvoter = function isUpvoter(user) {
  return this.upvoters.indexOf(user._id) >= 0;
}

commentSchema.methods.isDownvoter = function isDownvoter(user) {
  return this.downvoters.indexOf(user._id) >= 0;
}

commentSchema.methods.getUserVote = function getUserStatus(user) {
  if (user) {
    if (this.isUpvoter(user)) {
      return 'upvote'; 
    } else if (this.isDownvoter(user)) {
      return 'downvote';
    }
  }

  return '';
}

module.exports = mongoose.model('Comment', commentSchema);
