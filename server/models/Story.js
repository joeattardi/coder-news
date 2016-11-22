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
  votes: Number,
  submitted: Date
});

storySchema.methods.relativeSubmitted = function relativeSubmitted() {
  return moment(this.submitted).fromNow(); 
};

module.exports = mongoose.model('Story', storySchema);
