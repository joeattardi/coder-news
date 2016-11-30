const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const url = require('url');

const Story = require('./models/Story');
const storyController = require('./controllers/storyController');
const userController = require('./controllers/userController');
const ajaxController = require('./controllers/ajaxController');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/codernews');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(express.static('./client/public'));
app.use(session({
  secret: 'abc123',
  resave: false,
  saveUninitialized: false
}));

app.set('views', './server/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  const user = req.session.user;

  Story.find({}).then(stories => {
    res.render('index', { 
      stories,
      message,
      user
    });
  }).catch(err => {
    res.status(500).render('error', { error });
  });
});

app.get('/submit', storyController.viewSubmitPage);
app.post('/submit', storyController.submitStory);

app.get('/usernameExists', ajaxController.usernameExists);
app.get('/extractTitle', ajaxController.extractTitle); 

app.get('/signup', userController.viewSignUpPage);
app.post('/signup', userController.signup);
app.get('/login', userController.viewLoginPage);
app.post('/login', userController.login);
app.get('/logout', userController.logout);

app.listen(3000);
