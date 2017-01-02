import $ from 'jquery';


$(function() {
  const $button = $('#comment-submit-button');
  function checkEmptyComment() {
    const $textarea = $(this);
    $button.prop('disabled', $textarea.val() === '');
  }
  
  $('#comment').on('keyup', checkEmptyComment);
});
