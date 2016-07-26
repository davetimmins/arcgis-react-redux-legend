var origin = window.location.origin;
var pathname = window.location.pathname;
var locationPath = origin + pathname.replace(/\/+$/, '') + '/';

window.dojoConfig = {
  async: true,
  deps: ['app/main'],
  packages: [{
      name: 'react',
      location: locationPath + 'node_modules/react/dist',
      main: 'react.min'
  }, {
      name: 'react-dom',
      location: locationPath + 'node_modules/react-dom/dist',
      main: 'react-dom.min'
  }, {
      name: 'react-bootstrap',
      location: locationPath + 'node_modules/react-bootstrap/dist',
      main: 'react-bootstrap.min'
  }, {
      name: 'redux',
      location: locationPath + 'node_modules/redux/dist',
      main: 'redux.min'
  }, {
      name: 'react-redux',
      location: locationPath + 'node_modules/react-redux/dist',
      main: 'react-redux.min'
  }, {
      name: 'redux-thunk',
      location: locationPath + 'node_modules/redux-thunk/dist',
      main: 'redux-thunk.min'
  }, {
    name: 'app',
    location: locationPath + 'dist',
    main: 'main'
  }]
};
