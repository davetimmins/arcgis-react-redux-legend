var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/main.js',
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
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['transform-runtime']
        }
      }      
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({comments: false, compress: { warnings: false }, screw_ie8: true})
  ]
};
