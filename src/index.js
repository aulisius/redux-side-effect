import { connect } from "react-redux";

export { onSuccess, onFailure } from "./utils";

export { sideEffectReducer, sideEffectMiddleware } from "./ducks";

export { SideEffect } from "./component";

export const connectWrapper = (Component, reducerKey) =>
  connect(state => ({
    sideEffects: state[reducerKey].sideEffects
  }))(Component);
