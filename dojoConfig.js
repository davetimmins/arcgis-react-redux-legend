var origin = window.location.origin;
var pathname = window.location.pathname;
var locationPath = origin + pathname.replace(/\/+$/, '') + '/';

window.dojoConfig = {
  async: true,
  deps: ['app/main'],
  packages: [{
      name: 'react',
      location: locationPath + 'vendor/react/dist',
      main: 'react.min'
  }, {
      name: 'react-dom',
      location: locationPath + 'vendor/react-dom/dist',
      main: 'react-dom.min'
  }, {
      name: 'react-bootstrap',
      location: locationPath + 'vendor/react-bootstrap/dist',
      main: 'react-bootstrap.min'
  }, {
      name: 'redux',
      location: locationPath + 'vendor/redux/dist',
      main: 'redux.min'
  }, {
      name: 'react-redux',
      location: locationPath + 'vendor/react-redux/dist',
      main: 'react-redux.min'
  }, {
      name: 'redux-thunk',
      location: locationPath + 'vendor/redux-thunk/dist',
      main: 'redux-thunk.min'
  }, {
    name: 'app',
    location: locationPath + 'dist',
    main: 'main'
  }]
};
