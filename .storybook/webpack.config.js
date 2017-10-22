const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        loaders: ['raw-loader'],
      },
    ],
  },
  devtool: 'sourcemap',
};
