import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import AppMain from './components/app-main';
import AppReducers from './reducers/app-reducers';

const logger = createLogger({
  collapsed: (getState, action, logEntry) => !logEntry.error
});
const store = createStore(AppReducers, applyMiddleware(thunk, logger));

const contentElement = document.getElementById('app-container');
ReactDOM.render(
  <Provider store={store}>
    <AppMain />
  </Provider>,
  contentElement
);
