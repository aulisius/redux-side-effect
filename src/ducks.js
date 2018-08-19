import { onFailure, onSuccess } from "./utils";

export const actionTypes = {
  START_LISTENING: "[Side Effect] Mounted",
  STOP_LISTENING: "[Side Effect] Unmounting",

  UPDATE_SIDE_EFFECT: "[Side Effect] Update"
};

export const Effect = {
  READY: "ready",
  START: "start",
  SUCCESS: "success",
  FAILURE: "failure"
};

export const sideEffectInitialState = {
  state: Effect.READY,
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
      type: actionTypes.START_LISTENING,
      ...actionProps
    };
  },
  unlisten(key) {
    return {
      type: actionTypes.STOP_LISTENING,
      key
    };
  },
  updateSideEffect(actionProps, originalAction) {
    return {
      ...actionProps,
      originalAction,
      type: actionTypes.UPDATE_SIDE_EFFECT
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
    case actionTypes.START_LISTENING: {
      //TODO: Make filters work *properly* with multiple monitors
      const { monitor = [], key, shouldUpdate } = action;
      const [
        startsOn,
        succeedsOn = onSuccess(startsOn),
        failsOn = onFailure(startsOn)
      ] = monitor;
      return {
        ...state,
        listeningTo: [
          ...state.listeningTo,
          {
            sideEffect: Effect.START,
            actionType: startsOn,
            shouldUpdate,
            key
          },
          {
            sideEffect: Effect.SUCCESS,
            actionType: succeedsOn,
            shouldUpdate,
            key
          },
          {
            sideEffect: Effect.FAILURE,
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

    case actionTypes.STOP_LISTENING: {
      const { [action.key]: _, ...sideEffects } = state.sideEffects;

      return {
        ...state,
        listeningTo: state.listeningTo.filter(
          listenAction => listenAction.key !== action.key
        ),
        sideEffects
      };
    }

    case actionTypes.UPDATE_SIDE_EFFECT:
      const { sideEffect, originalAction } = action;
      return {
        ...state,
        sideEffects: {
          ...state.sideEffects,
          [action.key]: {
            state: sideEffect,
            isFetching: sideEffect === Effect.START,
            errors: originalAction.errors || originalAction.error,
            originalAction
          }
        }
      };

    default:
      return state;
  }
};
