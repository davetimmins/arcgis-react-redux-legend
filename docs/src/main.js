import React from "react";
import ReactDOM from "react-dom";
import {createStore,applyMiddleware} from "redux";
import {Provider} from "react-redux";
import thunk from "redux-thunk";

import AppMain from "./components/app-main";
import AppReducers from "./reducers/app-reducers";

const store = createStore(AppReducers, applyMiddleware(thunk));

const contentElement = document.getElementById("app-container");
ReactDOM.render(
  (
    <Provider store={store}>
      <AppMain />
    </Provider>
  ),
  contentElement
);
