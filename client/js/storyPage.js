import $ from 'jquery';

const FADE_SPEED = 200;

function confirmDeleteStory(event) {
  event.preventDefault();
  const $container = $(this).closest('.story-container');

  $container.find('.story-delete').fadeOut(FADE_SPEED, () => {
    $container.find('.story-delete-confirm-container').fadeIn(FADE_SPEED);
  }); 
}

function cancelDeleteStory(event) {
  event.preventDefault();
  const $container = $(this).closest('.story-container');

  $container.find('.story-delete-confirm-container').fadeOut(FADE_SPEED, () => {
    $container.find('.story-delete').fadeIn(FADE_SPEED);
  });
}

function deleteStory(event) {
  event.preventDefault();
  const $container = $(this).closest('.story-container');
  const storyId = $container.data('story-id');
  console.log(`Deleting story ${storyId}`);

  $.ajax({
    url: `/story/${storyId}`,
    method: 'DELETE'
  }).then(result => {
    window.location.href = '/'; 
  });
}

$(function() {
  const $button = $('#comment-submit-button');
  function checkEmptyComment() {
    const $textarea = $(this);
    $button.prop('disabled', $textarea.val() === '');
  }
  
  $('#comment').on('keyup', checkEmptyComment);

  $('.story-container .story-delete').on('click', confirmDeleteStory);
  $('.story-delete-cancel').on('click', cancelDeleteStory);
  $('.story-delete-confirm').on('click', deleteStory);
});
