import $ from 'jquery';

function deleteComment(event) {
  event.preventDefault();

  const $container = $(this).closest('.comment');
  const commentId = $container.closest('.comment').data('comment-id');

  $.ajax({
    method: 'DELETE',
    url: `/comment/${commentId}`
  }).then(result => {
    $container.fadeOut(() => {
      $container.remove();
      $('.comments-link').html(result.comments !== 1 ? `${result.comments} comments` : '1 comment');
    });
  });
}

function confirmDeleteComment(event) {
  event.preventDefault();

  const $this = $(this);
  const $confirmation = $this.closest('.comment').find('.comment-delete-confirm-container');

  $this.hide(); 
  $confirmation.show();
}

function cancelDeleteComment(event) {
  event.preventDefault();

  const $this = $(this);
  const $container = $this.closest('.comment');
  const $deleteLink = $container.find('.comment-delete');
  const $confirmationContainer = $container.find('.comment-delete-confirm-container');

  $confirmationContainer.hide();
  $deleteLink.show();
}

$(function () {
  $('.comment-delete').on('click', confirmDeleteComment); 
  $('.comment-delete-confirm').on('click', deleteComment);
  $('.comment-delete-cancel').on('click', cancelDeleteComment);
});
