const Story = require('./models/Story');

const GRAVITY = 1.8;

function updateScore(story) {
  const millisSinceSubmission = Date.now() - story.submitted.getTime();
  const hoursSinceSubmission = millisSinceSubmission / (60 * 60 * 1000);

  story.score = story.votes / Math.exp(hoursSinceSubmission, GRAVITY);
};

function updateAllScores() {
  Story.find({}).then(stories => {
    stories.forEach(story => {
      updateScore(story);
      story.save()
    });
  }).catch(error => {
    console.error(error); 
  });
};

module.exports = {
  updateScore,
  updateAllScores
};
