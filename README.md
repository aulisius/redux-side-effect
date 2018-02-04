# redux-side-effect
Declarative React/Redux component to handle side effects


## The Problem

Have you ever had to do something like the below snippet in your redux reducers?

```js
switch (action.type) {
  case "GET_ALL_ITEMS":
    return {
      items: [],
      gettingItems: true,
      apiError: null
    };
  case "GET_ALL_ITEMS_SUCCESS":
    return {
      ...state,
      items: action.response,
      gettingItems: false,
    };
  case "GET_ALL_ITEMS_ERROR":
    return {
      ...state,
       gettingItems: false,
       apiError: action.error
    };
  default:
    return state;
}
```
