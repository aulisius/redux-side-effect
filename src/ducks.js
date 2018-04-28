import { onSuccess, onFailure } from "./utils";

export const actionTypes = {
  START_LISTENING: "[Redux Side Effect] Mounted",
  STOP_LISTENING: "[Redux Side Effect] Unmounting",

  UPDATE_SIDE_EFFECT: "[Redux Side Effect] Update"
};

const SideEffect = {
  NONE: "none",
  START: "start",
  SUCCESS: "success",
  FAILURE: "failure"
};

export const sideEffectInitialState = {
  state: SideEffect.NONE,
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
      type: actionTypes.UPDATE_SIDE_EFFECT,
      ...actionProps,
      originalAction
    };
  }
};

export const sideEffectMiddleware = reducerKey => store => next => action => {
  const result = next(action);
  const state = store.getState()[reducerKey];
  state.listeningTo
    .filter(listenAction => listenAction.actionType === action.type)
    .forEach(listenAction =>
      store.dispatch(actions.updateSideEffect(listenAction, action))
    );
  return result;
};

export const sideEffectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.START_LISTENING: {
      const { monitor = [], key } = action;
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
            sideEffect: SideEffect.START,
            actionType: startsOn,
            key
          },
          {
            sideEffect: SideEffect.SUCCESS,
            actionType: succeedsOn,
            key
          },
          {
            sideEffect: SideEffect.FAILURE,
            actionType: failsOn,
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
      const newListeningTo = state.listeningTo.filter(
        listenAction => listenAction.key !== action.key
      );

      const {
        [action.key]: monitorToBeRemoved,
        ...sideEffects
      } = state.sideEffects;

      return {
        ...state,
        listeningTo: newListeningTo,
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
            isFetching: sideEffect === "start",
            errors: originalAction.errors || originalAction.error,
            originalAction
          }
        }
      };

    default:
      return state;
  }
};
