const mongoose = require('mongoose');
const moment = require('moment');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  submitter: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  domain: String,
  upvoters: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  downvoters: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  },
  votes: {
    type: Number,
    default: 0
  },
  submitted: Date
});

storySchema.methods.relativeSubmitted = function relativeSubmitted() {
  return moment(this.submitted).fromNow(); 
};

storySchema.methods.getUserVote = function getUserStatus(user) {
  if (user) {
    if (this.isUpvoter(user)) {
      return 'upvote'; 
    } else if (this.isDownvoter(user)) {
      return 'downvote';
    }
  }

  return '';
}

storySchema.methods.isUpvoter = function isUpvoter(user) {
  return this.upvoters.indexOf(user._id) >= 0;
}

storySchema.methods.isDownvoter = function isDownvoter(user) {
  return this.downvoters.indexOf(user._id) >= 0;
}

module.exports = mongoose.model('Story', storySchema);
