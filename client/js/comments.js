import $ from 'jquery';
import markdown from 'markdown';

const FADE_SPEED = 200;

function deleteComment(event) {
  event.preventDefault();

  const $container = $(this).closest('.comment-container');
  const commentId = $container.data('comment-id');

  $.ajax({
    method: 'DELETE',
    url: `/comment/${commentId}`
  }).then(result => {
    $container.fadeOut(FADE_SPEED, () => {
      $container.remove();
      $('.comments-link').html(result.comments !== 1 ? `${result.comments} comments` : '1 comment');
    });
  });
}

function confirmDeleteComment(event) {
  event.preventDefault();

  const $this = $(this);
  const $confirmation = $this.closest('.comment').find('.comment-delete-confirm-container');

  $this.fadeOut(FADE_SPEED, () => {
    $confirmation.fadeIn(FADE_SPEED);
  });
}

function cancelDeleteComment(event) {
  event.preventDefault();

  const $this = $(this);
  const $container = $this.closest('.comment');
  const $deleteLink = $container.find('.comment-delete');
  const $confirmationContainer = $container.find('.comment-delete-confirm-container');

  $confirmationContainer.fadeOut(FADE_SPEED, () => {
    $deleteLink.fadeIn(FADE_SPEED);
  });
}

function editComment(event) {
  event.preventDefault();

  const $container = $(this).closest('.comment-container');
  $container.find('.comment').fadeOut(FADE_SPEED, () => {
    $container.find('.comment-edit-form').fadeIn(FADE_SPEED);
  });
}

function cancelEditComment(event) {
  event.preventDefault();

  const $container = $(this).closest('.comment-container');
  $container.find('.comment-edit-form').fadeOut(FADE_SPEED, () => {
    $container.find('.comment').fadeIn(FADE_SPEED);
  });
}

function submitEditComment(event) {
  event.preventDefault();

  const $this = $(this);
  const $container = $this.closest('.comment-container');

  const commentId = $container.data('comment-id');
  const commentText = $this.find('textarea').val();

  $.ajax({
    method: 'POST',
    url: `/comment/${commentId}`,
    data: {
      commentText
    }
  }).then(() => {
    $container.find('.comment-body').html(markdown.markdown.toHTML(commentText));
    $container.find('.comment-edit-form').fadeOut(FADE_SPEED, () => {
      $container.find('.comment').fadeIn(FADE_SPEED);
    });
  });
}

$(function () {
  $('.comment-delete').on('click', confirmDeleteComment); 
  $('.comment-delete-confirm').on('click', deleteComment);
  $('.comment-delete-cancel').on('click', cancelDeleteComment);

  $('.comment-edit-form form').on('submit', submitEditComment);
  $('.comment-edit').on('click', editComment);
  $('.comment-edit-cancel').on('click', cancelEditComment);
});
