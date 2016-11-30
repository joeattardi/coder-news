import $ from 'jquery';
import 'jquery-validation';

$(document).ready(function () {
  const $loginForm = $('#login-form');

  $loginForm.validate({
    errorElement: 'div'
  });

  $loginForm.on('submit', () => {
    if ($loginForm.valid()) {
      $('#submit-button').prop('disabled', true);
    }
  });
});
