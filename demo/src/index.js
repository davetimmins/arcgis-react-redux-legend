import React from 'react';
import {render} from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import MapUi from './components/map-view';
import AppReducers from './reducers/app-reducers';

const logger = createLogger({
  collapsed: (getState, action, logEntry) => !logEntry.error
});
const store = createStore(AppReducers, applyMiddleware(thunk, logger));

const options = {
  url: 'https://js.arcgis.com/4.12/',
};
const mapId = 'Legend example';

render(
  <Provider store={store}>
    <MapUi mapId={mapId} options={options} />
  </Provider>,
  document.getElementById('demo')
);
