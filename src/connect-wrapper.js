import { connect } from "react-redux";
export const connectWrapper = (Component, reducerKey) =>
  connect(state => ({
    sideEffects: state[reducerKey].sideEffects
  }))(Component);
