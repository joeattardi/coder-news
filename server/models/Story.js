const mongoose = require('mongoose');
const moment = require('moment');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  url: {
    type: String,
    required: [true, 'URL is required']
  },
  domain: String,
  votes: Number,
  submitted: Date
});

storySchema.methods.relativeSubmitted = function relativeSubmitted() {
  return moment(this.submitted).fromNow(); 
};

module.exports = mongoose.model('Story', storySchema);
