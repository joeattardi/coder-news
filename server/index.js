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
const scoreUpdater = require('./score-updater');

const ITEMS_PER_PAGE = 25;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(express.static('./client/public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.set('views', './server/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  const user = req.session.user;

  const start = parseInt(req.query.start || '0');
  let total;

  Story.count({}).then(count => {
    total = count;
    return Story.find({})
      .skip(start)
      .limit(ITEMS_PER_PAGE)
      .sort([['score', 'descending']])
      .populate('submitter')
    }).then(stories => {
        Story.count({})
        res.render('index', {
          stories,
          message,
          user,
          start,
          total,
          ITEMS_PER_PAGE
        });
    }).catch(err => {
      res.status(500).render('error', { error });
    });
});

app.get('/submit', storyController.viewSubmitPage);
app.post('/submit', storyController.submitStory);
app.get('/story/:storyId', storyController.viewStory);
app.post('/story/:storyId/comments', storyController.postComment);

app.get('/usernameExists', ajaxController.usernameExists);
app.get('/extractTitle', ajaxController.extractTitle); 
app.post('/story/:storyId/vote', ajaxController.voteStory);
app.post('/comment/:commentId/vote', ajaxController.voteComment);
app.post('/comment/:commentId', ajaxController.editComment);
app.delete('/comment/:commentId', ajaxController.deleteComment);

app.get('/signup', userController.viewSignUpPage);
app.post('/signup', userController.signup);
app.get('/login', userController.viewLoginPage);
app.post('/login', userController.login);
app.get('/logout', userController.logout);

scoreUpdater.updateAllScores();
setInterval(scoreUpdater.updateAllScores, 1000 * 60 * 5);

app.listen(3000);
