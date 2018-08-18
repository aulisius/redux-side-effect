import PropTypes from "prop-types";
import { Component } from "react";
import { actions, sideEffectInitialState } from "./ducks";
import { onFailure, onSuccess } from "./utils";

export class SideEffect extends Component {
  constructor(props) {
    super(props);
    this.keys = [];
  }

  shouldComponentUpdate(nextProps) {
    const { sideEffects: nextSideEffects } = nextProps;
    const {
      startsOn,
      succeedsOn,
      failsOn,
      monitors = [[startsOn, succeedsOn, failsOn]]
    } = this.props;
    return monitors.some(
      (
        [
          startsOn,
          succeedsOn = onSuccess(startsOn),
          failsOn = onFailure(startsOn)
        ],
        i
      ) => {
        const { originalAction } = nextSideEffects[this.keys[i]] || {};
        return !originalAction
          ? true
          : [startsOn, succeedsOn, failsOn].includes(originalAction.type);
      }
    );
  }

  componentDidMount() {
    const {
      startsOn,
      succeedsOn,
      failsOn,
      shouldUpdate,
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
      monitors = [[startsOn]]
    } = this.props;
    return (
      render(
        ...monitors.map(
          (_, i) => sideEffects[this.keys[i]] || sideEffectInitialState
        )
      ) || null
    );
  }
}

SideEffect.propTypes = {
  startsOn: PropTypes.string,
  succeedsOn: PropTypes.string,
  sideEffects: PropTypes.object,
  shouldUpdate: PropTypes.func,
  failsOn: PropTypes.string,
  monitors: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  children: PropTypes.func,
  render: PropTypes.func,
  dispatch: PropTypes.func.isRequired
};

SideEffect.defaultProps = {
  startsOn: "",
  succeedsOn: "",
  failsOn: "",
  sideEffects: {},
  shouldUpdate: _ => true,
  monitors: undefined,
  children: _ => {},
  render: undefined,
  dispatch: _ => {}
};
