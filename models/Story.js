const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: String,
  url: String,
  votes: Number,
  submitted: Date
});

module.exports = mongoose.model('Story', storySchema);
