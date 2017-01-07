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
      const commentCount = $('.comment-container').length;
      $('.comments-link').html(commentCount !== 1 ? `${commentCount} comments` : '1 comment');
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

  const existingCommentText = $container.find('.comment-edit-original:first').val();
  $container.find('.comment-edit-form:first textarea').val(existingCommentText);
  $container.find('.comment-edit-submit:first').prop('disabled', false);
  $container.find('.comment-votes:first').fadeOut(FADE_SPEED);
  $container.find('.comment:first').fadeOut(FADE_SPEED, () => {
    $container.find('.comment-edit-form:first').fadeIn(FADE_SPEED);
  });
}

function cancelEditComment(event) {
  event.preventDefault();

  const $container = $(this).closest('.comment-container');
  $container.find('.comment-edit-form').fadeOut(FADE_SPEED, () => {
    $container.find('.comment-votes').fadeIn(FADE_SPEED);
    $container.find('.comment').fadeIn(FADE_SPEED);
  });
}

function submitEditComment(event) {
  event.preventDefault();

  const $this = $(this);
  const $container = $this.closest('.comment-container');

  const commentId = $container.data('comment-id');
  const commentText = $this.find('textarea').val();

  const $button = $this.find('.comment-edit-submit');
  $button.prop('disabled', true);

  $.ajax({
    method: 'POST',
    url: `/comment/${commentId}`,
    data: {
      commentText
    }
  }).then(() => {
    $container.find('.comment-edit-original').val(commentText);
    $container.find('.comment-body').html(markdown.markdown.toHTML(commentText));
    $container.find('.comment-edit-form').fadeOut(FADE_SPEED, () => {
      $container.find('.comment-votes').fadeIn(FADE_SPEED);
      $container.find('.comment').fadeIn(FADE_SPEED);
      $button.prop('disabled', false);
    });
  });
}

function checkEmptyComment() {
  const $textarea = $(this);
  $textarea.closest('form').find('.submit').prop('disabled', 
    $textarea.val() === '');
}

function showReplyForm(event) {
  event.preventDefault();
  const $replyForm = $(this).closest('.comment-container').find('.comment-reply-form:first');
  $replyForm.fadeIn(FADE_SPEED, () => {
    $replyForm.find('textarea').focus();
  });
}

function cancelReply(event) {
  event.preventDefault();
  const $replyForm = $(this).closest('.comment-container').find('.comment-reply-form:first');
  $replyForm.fadeOut(FADE_SPEED, () => {
    $replyForm.find('textarea').val('');
  });
}

function submitReply(event) {
  event.preventDefault();

  const $this = $(this);
  const $container = $this.closest('.comment-container');

  const commentId = $container.data('comment-id');
  const commentText = $this.find('textarea').val();

  const $button = $this.find('.comment-reply-submit');
  $button.prop('disabled', true);

  $.ajax({
    method: 'POST',
    url: `/comment/${commentId}/reply`,
    data: {
      commentText
    }
  }).then(result => {
    const $newMarkup = $(result.markup);
    addEventListeners($newMarkup);

    $('.comments-link').html(result.comments !== 1 ? `${result.comments} comments` : '1 comment');
    $container.find('.comment-reply-form:first').fadeOut(FADE_SPEED, () => {
      $container.find('.comment-replies:first').append($newMarkup); 
      $container.find('.comment-reply:first').on('click', showReplyForm);
    });
  });
}

function addEventListeners($parent) {
  $parent.find('.comment-delete').on('click', confirmDeleteComment); 
  $parent.find('.comment-delete-confirm').on('click', deleteComment);
  $parent.find('.comment-delete-cancel').on('click', cancelDeleteComment);

  $parent.find('.comment-edit-form form').on('submit', submitEditComment);
  $parent.find('.comment-edit').on('click', editComment);
  $parent.find('.comment-edit-cancel').on('click', cancelEditComment);
  $parent.find('.comment-edit-form textarea').on('keyup', checkEmptyComment);

  $parent.find('.comment-reply').on('click', showReplyForm);
  $parent.find('.comment-reply-cancel').on('click', cancelReply);
  $parent.find('.comment-reply-form textarea').on('keyup', checkEmptyComment);
  $parent.find('.comment-reply-form form').on('submit', submitReply);
}

$(function () {
  $('.comment-delete').on('click', confirmDeleteComment); 
  $('.comment-delete-confirm').on('click', deleteComment);
  $('.comment-delete-cancel').on('click', cancelDeleteComment);

  $('.comment-edit-form form').on('submit', submitEditComment);
  $('.comment-edit').on('click', editComment);
  $('.comment-edit-cancel').on('click', cancelEditComment);
  $('.comment-edit-form textarea').on('keyup', checkEmptyComment);

  $('.comment-reply').on('click', showReplyForm);
  $('.comment-reply-cancel').on('click', cancelReply);
  $('.comment-reply-form textarea').on('keyup', checkEmptyComment);
  $('.comment-reply-form form').on('submit', submitReply);
});
