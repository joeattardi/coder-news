const webpack = require('webpack');

module.exports = {
  entry: {
    submitPage: './client/js/submitPage.js',
    signupPage: './client/js/signupPage.js',
    storyPage: './client/js/storyPage.js',
    loginPage: './client/js/loginPage.js',
    storyVoting: './client/js/storyVoting.js',
    commentVoting: './client/js/commentVoting.js',
    comments: './client/js/comments.js'
  },

  output: {
    path: './client/public/js',
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery' 
    })
  ]
};
