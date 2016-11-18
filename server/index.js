const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const url = require('url');

const Story = require('./models/Story');
const storyController = require('./controllers/storyController');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/codernews');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(express.static('./client/public'));
app.set('views', './server/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  Story.find({}).then(stories => {
    res.render('index', { stories });
  }).catch(err => {
    res.status(500).send(); 
  });
});

app.get('/submit', storyController.viewSubmitPage);
app.post('/submit', storyController.submitStory);

app.listen(3000);
