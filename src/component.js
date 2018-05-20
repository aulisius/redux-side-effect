import { Component } from "react";
import { func, string, object, arrayOf } from "prop-types";

import { actions, sideEffectInitialState } from "./ducks";
import { onSuccess, onFailure } from "./utils";

export class SideEffect extends Component {
  static propTypes = {
    startsOn: string,
    succeedsOn: string,
    sideEffects: object,
    shouldUpdate: func,
    failsOn: string,
    monitors: arrayOf(arrayOf(string)),
    children: func,
    render: func,
    dispatch: func.isRequired
  };

  keys = [];

  shouldComponentUpdate(nextProps, nextState) {
    const { sideEffects: nextSideEffects } = nextProps;
    const {
      startsOn,
      succeedsOn = onSuccess(startsOn),
      failsOn = onFailure(startsOn),
      monitors = [[startsOn, succeedsOn, failsOn]]
    } = this.props;
    return monitors.some((monitor, index) => {
      const { originalAction } = nextSideEffects[this.keys[index]] || {};
      const [
        startsOn,
        succeedsOn = onSuccess(startsOn),
        failsOn = onFailure(startsOn)
      ] = monitor;
      return !originalAction
        ? true
        : [startsOn, succeedsOn, failsOn].includes(originalAction.type);
    });
  }

  componentDidMount() {
    const {
      startsOn,
      succeedsOn,
      failsOn,
      shouldUpdate = _ => true,
      monitors = [[startsOn, succeedsOn, failsOn]]
    } = this.props;
    monitors.forEach(monitor => {
      const key = Symbol();
      this.keys.push(key);
      this.props.dispatch(
        actions.listen({
          monitor,
          shouldUpdate,
          key
        })
      );
    });
  }

  componentWillUnmount() {
    this.keys.map(actions.unlisten).forEach(this.props.dispatch);
    this.keys = [];
  }

  render() {
    const {
      sideEffects,
      children,
      render = children,
      startsOn,
      succeedsOn,
      failsOn,
      monitors = [[startsOn, succeedsOn, failsOn]]
    } = this.props;
    return (
      render(
        ...monitors.map(
          (monitor, index) =>
            sideEffects[this.keys[index]] || sideEffectInitialState
        )
      ) || null
    );
  }
}
