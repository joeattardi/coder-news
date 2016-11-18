exports.getErrorsByParam = function getErrorsByParam(errors) {
  const errorsByParam = {};

  if (errors) {
    errors.forEach(error => errorsByParam[error.param] = error.msg);
  }

  return errorsByParam;
};
