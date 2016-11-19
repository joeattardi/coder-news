const axios = require('axios');

const TITLE_REGEX = /<title>(.*)<\/title>/;

exports.extractTitle = function extractTitle(req, res) {
  axios.get(req.query.url).then(result => {
    const matcher = TITLE_REGEX.exec(result.data);
    if (matcher) {
      res.json({
        title: matcher[1]
      });
    } else {
      res.status(401).json({
        error: 'No title found'
      });
    }
  }).catch(err => {
    res.status(500).json({
      error: err.message
    }); 
  });
};
