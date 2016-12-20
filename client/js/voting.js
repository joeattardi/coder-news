import $ from 'jquery';

function vote($button, $storyContainer, direction) {
  const storyId = $storyContainer.data('story-id');

  return $.ajax({
    method: 'POST',
    url: `/vote?direction=${direction}&_id=${storyId}`
  }).then(function (result) {
    $storyContainer.find('.story-votes').html(result.votes); 
    $button.toggleClass('active');
  });
}

function upvote() {
  const $button = $(this);
  const $storyContainer = $button.closest('.story-container');
  vote($button, $storyContainer, 1).then(() => {
    $storyContainer.find('.downvote').removeClass('active');
  });
}

function downvote() {
  const $button = $(this);
  const $storyContainer = $button.closest('.story-container');
  vote($button, $storyContainer, -1).then(() => {
    $storyContainer.find('.upvote').removeClass('active');
  });
}

$(function () {
  $('.upvote').on('click', upvote);
  $('.downvote').on('click', downvote);
});
