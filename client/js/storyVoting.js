import $ from 'jquery';

function vote($storyContainer, direction, removeClass, toggleClass) {
  const storyId = $storyContainer.data('story-id');

  return $.ajax({
    method: 'POST',
    url: `/story/${storyId}/vote?direction=${direction}`
  }).then(result => {
    $storyContainer.find('.story-votes-container')
      .removeClass(removeClass)
      .toggleClass(toggleClass);
    $storyContainer.find('.story-votes').html(result.votes); 
  });
}

function upvote() {
  const $storyContainer = $(this).closest('.story-container');
  vote($storyContainer, 1, 'downvote', 'upvote');
}

function downvote() {
  const $storyContainer = $(this).closest('.story-container');
  vote($storyContainer, -1, 'upvote', 'downvote');
}

$(function () {
  $('.story-votes-container .vote-button.upvote').on('click', upvote);
  $('.story-votes-container .vote-button.downvote').on('click', downvote);
});
