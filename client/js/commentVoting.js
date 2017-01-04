import $ from 'jquery';

function vote($commentContainer, direction, removeClass, toggleClass) {
  const commentId = $commentContainer.data('comment-id');

  return $.ajax({
    method: 'POST',
    url: `/comment/${commentId}/vote?direction=${direction}`
  }).then(result => {
    $commentContainer.find('.comment-votes')
      .removeClass(removeClass)
      .toggleClass(toggleClass);
    $commentContainer.find('.comment-vote-count').html(`${result.votes} ${result.votes === 1 ? 'point' : 'points'}`);
  });
}

function upvote() {
  const $commentContainer = $(this).closest('.comment-container');
  vote($commentContainer, 1, 'downvote', 'upvote');
}

function downvote() {
  const $commentContainer = $(this).closest('.comment-container');
  vote($commentContainer, -1, 'upvote', 'downvote');
}

$(function () {
  $('.comment-votes .vote-button.upvote').on('click', upvote);
  $('.comment-votes .vote-button.downvote').on('click', downvote);
});
