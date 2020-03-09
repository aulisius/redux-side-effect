import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, sideEffectInitialState } from "./ducks";

export function useSideEffect(props) {
  let dispatch = useDispatch();
  let keys = useRef([]);
  let sideEffects = useSelector(state => state.__sideEffects.sideEffects);
  let {
    startsOn,
    succeedsOn,
    failsOn,
    shouldUpdate,
    monitors = [[startsOn, succeedsOn, failsOn]]
  } = props;
  useEffect(() => {
    monitors.forEach(monitor => {
      const key = Symbol();
      keys.current.push(key);
      dispatch(actions.listen({ monitor, shouldUpdate, key }));
    });
    return () => {
      keys.current.map(actions.unlisten).forEach(dispatch);
      keys.current = [];
    };
  }, [dispatch, shouldUpdate, monitors]);
  return monitors.map(
    (_, i) => sideEffects[keys.current[i]] || sideEffectInitialState
  );
}
