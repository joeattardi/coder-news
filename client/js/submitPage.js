import $ from 'jquery';
import 'jquery-validation';

$(document).ready(function () {
  const $urlField = $('#url');
  const $titleField = $('#title');
  const $suggestTitle = $('#suggest-title');

  $suggestTitle.on('click', event => {
    event.preventDefault();
    $suggestTitle.prop('disabled', true);
    $.get(`/extractTitle?url=${$urlField.val()}`, data => {
      $titleField.val(data.title);
    }).always(() => {
      $suggestTitle.prop('disabled', false);
    });
  });

  $urlField.on('keyup', event => {
    $suggestTitle.prop('disabled', !$urlField.valid());
  });

  $('#submit-form').validate({
    errorElement: 'div',
    errorPlacement: (error, element) => {
      if (element.attr('id') === 'url') {
        error.insertAfter($suggestTitle);
      } else {
        error.insertAfter(element);
      }
    },
    rules: {
      url: {
        required: true,
        url: true
      }
    }
  });
});
