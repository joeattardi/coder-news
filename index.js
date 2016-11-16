const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');

const Story = require('./models/Story');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/codernews');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('./public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  Story.find({}).then(stories => {
    res.render('index', { stories, moment });
  }).catch(err => {
    res.status(500).send(); 
  });
});

app.get('/submit', (req, res) => {
  res.render('submit');
});

app.post('/submit', (req, res) => {
  const story = new Story({
    title: req.body.title,
    url: req.body.url,
    submitted: new Date()
  });

  story.save().then(document => {
    res.redirect('/');
  }).catch(err => {
    res.status(500).send(); 
  });

});

app.listen(3000);
