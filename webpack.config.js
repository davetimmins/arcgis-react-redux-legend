var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  devtool: 'source-map',
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'arcgis-react-redux-legend.js',
    libraryTarget: 'umd'
  },
  target: 'node',
  externals: nodeExternals(),
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
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({comments: false, compress: { warnings: false }, screw_ie8: true, sourceMap: true})
  ]
};
