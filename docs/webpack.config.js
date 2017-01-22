var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: {
    index: ['babel-polyfill','./src/main.js'],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'main.js'
  },

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,   
        exclude: /node_modules/,      
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      }      
    ]
  }
};
