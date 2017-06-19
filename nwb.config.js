module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ArcgisReactReduxLegend',
      externals: {
        'esri-loader': 'EsriLoader',
        'prop-types': 'PropTypes',
        react: 'React',
        'react-dom': 'ReactDDOM',
        'react-redux': 'ReactRedux',
        'react-thunk': 'ReactThunk'
      }
    }
  },
  webpack: {
    html: {
      template: 'demo/src/index.html',
      publicPath: 'https://davetimmins.com/arcgis-react-redux-legend/'
    }
  }
}