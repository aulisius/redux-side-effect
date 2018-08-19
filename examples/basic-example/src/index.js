import {
  sideEffectMiddleware,
  sideEffectReducer
} from "@faizaanceg/redux-side-effect";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import Logger from "redux-logger";
import thunk from "redux-thunk";
import GithubUser from "./github-user";
import { githubReducer } from "./github-user/ducks";

const middleware = [thunk, sideEffectMiddleware("sideEffect"), Logger];

const mainReducer = combineReducers({
  github: githubReducer,
  sideEffect: sideEffectReducer
});

const createAppStore = (initialState = {}) =>
  createStore(
    mainReducer,
    initialState,
    compose(applyMiddleware(...middleware))
  );

const store = createAppStore({});

const App = () => (
  <Provider store={store}>
    <GithubUser />
  </Provider>
);

render(<App />, document.getElementById("root"));
