import $ from 'jquery';
import 'jquery-validation';

$(document).ready(function () {
  $('#submit-form').validate({
    errorElement: 'div',
    rules: {
      url: {
        required: true,
        url: true
      }
    }
  });
});
