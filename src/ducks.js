import { onFailure, onSuccess } from "./utils";

export const actionTypes = {
  START: "[Side Effect] Start",
  STOP: "[Side Effect] Stop",
  UPDATE: "[Side Effect] Update"
};

export const EffectType = {
  READY: "ready",
  START: "start",
  SUCCESS: "success",
  FAILURE: "failure"
};

export const sideEffectInitialState = {
  state: EffectType.READY,
  isFetching: false,
  errors: null
};

const initialState = {
  listeningTo: [],
  sideEffects: {}
};

export const actions = {
  listen(actionProps) {
    return {
      type: actionTypes.START,
      ...actionProps
    };
  },
  unlisten(key) {
    return {
      type: actionTypes.STOP,
      key
    };
  },
  updateSideEffect(actionProps, originalAction) {
    return {
      ...actionProps,
      originalAction,
      type: actionTypes.UPDATE
    };
  }
};

export const sideEffectMiddleware = reducerKey => store => next => action => {
  const result = next(action);
  if (action.type.startsWith("[Side Effect]")) {
    return result;
  }
  const state = store.getState()[reducerKey];
  state.listeningTo
    .filter(
      listenAction =>
        listenAction.actionType === action.type &&
        listenAction.shouldUpdate(action)
    )
    .forEach(listenAction =>
      store.dispatch(actions.updateSideEffect(listenAction, action))
    );
  return result;
};

export const sideEffectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START: {
      //TODO: Make filters work *properly* with multiple monitors
      const { monitor = [], key, shouldUpdate } = action;
      const [
        startsOn,
        succeedsOn = onSuccess(startsOn),
        failsOn = onFailure(startsOn)
      ] = monitor;
      if (typeof startsOn === "undefined") {
        console.warn("Invalid action type");
        return state;
      }
      return {
        ...state,
        listeningTo: [
          ...state.listeningTo,
          {
            sideEffect: EffectType.START,
            actionType: startsOn,
            shouldUpdate,
            key
          },
          {
            sideEffect: EffectType.SUCCESS,
            actionType: succeedsOn,
            shouldUpdate,
            key
          },
          {
            sideEffect: EffectType.FAILURE,
            actionType: failsOn,
            shouldUpdate,
            key
          }
        ],
        sideEffects: {
          ...state.sideEffects,
          [key]: sideEffectInitialState
        }
      };
    }

    case actionTypes.STOP: {
      const { [action.key]: _, ...sideEffects } = state.sideEffects;

      return {
        ...state,
        listeningTo: state.listeningTo.filter(
          listenAction => listenAction.key !== action.key
        ),
        sideEffects
      };
    }

    case actionTypes.UPDATE:
      const { sideEffect, originalAction } = action;
      return {
        ...state,
        sideEffects: {
          ...state.sideEffects,
          [action.key]: {
            state: sideEffect,
            isFetching: sideEffect === EffectType.START,
            errors: originalAction.error,
            originalAction
          }
        }
      };

    default:
      return state;
  }
};
