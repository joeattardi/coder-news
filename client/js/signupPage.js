import $ from 'jquery';
import 'jquery-validation';

function checkUsername() {
  const $warning = $('#username-taken-warning');
  const $submitButton = $('#submit-button');

  $.get(`/usernameExists?username=${this.value}`, data => {
    if (data.exists) {
      $warning.show();
      $submitButton.prop('disabled', true);
    } else {
      $warning.hide();
      $submitButton.prop('disabled', false);
    }
  });
}

function setupValidation() {
  $('#signup-form').validate({
    errorElement: 'div',
    rules: {
      confirmPassword: {
        equalTo: '#password'
      }
    },
    messages: {
      confirmPassword: {
        equalTo: 'Passwords do not match.'
      }
    }
  });
}

$(document).ready(function () {
  const $usernameField = $('#username');
  $usernameField.on('blur', checkUsername);

  setupValidation();
});
