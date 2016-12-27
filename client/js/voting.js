import $ from 'jquery';

function vote($button, $storyContainer, direction) {
  const storyId = $storyContainer.data('story-id');

  return $.ajax({
    method: 'POST',
    url: `/vote?direction=${direction}&_id=${storyId}`
  }).then(result => {
    $storyContainer.find('.story-votes').html(result.votes); 
  });
}

function upvote() {
  const $button = $(this);
  const $storyContainer = $button.closest('.story-container');
  vote($button, $storyContainer, 1).then(() => {
    $storyContainer.find('.story-votes-container')
      .removeClass('downvote')
      .toggleClass('upvote');
  });
}

function downvote() {
  const $button = $(this);
  const $storyContainer = $button.closest('.story-container');
  vote($button, $storyContainer, -1).then(() => {
    $storyContainer.find('.story-votes-container')
      .removeClass('upvote')
      .toggleClass('downvote');
  });
}

$(function () {
  $('.vote-button.upvote').on('click', upvote);
  $('.vote-button.downvote').on('click', downvote);
});
