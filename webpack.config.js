var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'arcgis-redux-legend.js',
    libraryTarget: 'umd'
  },
  externals: nodeExternals(),

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
      },
      {
        test: /\.css$/,
        loader: 'style!css?importLoaders=1'
      },      
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({comments: false, compress: { warnings: false }, screw_ie8: true})
  ]
};
