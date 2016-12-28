const mongoose = require('mongoose');
const moment = require('moment');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
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

module.exports = mongoose.model('Comment', commentSchema);
