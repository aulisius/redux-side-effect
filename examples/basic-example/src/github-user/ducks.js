import { onFailure, onSuccess } from "@faizaanceg/redux-side-effect";
export const actionTypes = {
  GET_GITHUB_USER: "[Github] Get user"
};

const initialState = {
  user: {}
};

export const githubReducer = (state = initialState, action) => {
  switch (action.type) {
    case onSuccess(actionTypes.GET_GITHUB_USER): {
      return {
        ...state,
        user: action.response
      };
    }
    default:
      return state;
  }
};

export const actions = {
  getUser: () => ({
    type: actionTypes.GET_GITHUB_USER
  }),
  getUserSuccess: response => ({
    type: onSuccess(actionTypes.GET_GITHUB_USER),
    response
  }),
  getUserFailure: error => ({
    type: onFailure(actionTypes.GET_GITHUB_USER),
    error
  }),
  getUserThunk: payload => dispatch => {
    dispatch(actions.getUser());
    const { username } = payload;
    const fetchUrl = `https://api.github.com/users/${username}`;
    setTimeout(() => {
      fetch(fetchUrl)
        .then(res => res.json())
        .then(user => {
          if (!user.login) {
            throw new Error("Not found");
          }
          dispatch(actions.getUserSuccess(user));
        })
        .catch(error => dispatch(actions.getUserFailure(error)));
    }, 5000);
  }
};
