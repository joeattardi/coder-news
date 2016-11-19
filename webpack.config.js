const webpack = require('webpack');

module.exports = {
  entry: {
    submitPage: './client/js/submitPage.js'
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
