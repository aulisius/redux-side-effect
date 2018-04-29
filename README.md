# redux-side-effect

Redux `connect`ed React component to handle side effects

## The Problem

Working/Monitoring side effects is messy business. Though this has become better
in recent times with `redux-saga` and the like, I couldn't find an easy way to
integrate this flow into the UI markup. Maintaining values like `isLoading`,
`isSuccess` across the various reducers leads to boilerplate-ish code and
annoying bugs.

I came upon this solution while playing around with redux middelwares and render
props but this general problem has been long solved.

Some reading material on the topic

* [How Elm Slays a UI Antipattern](http://blog.jenkster.com/2016/06/how-elm-slays-a-ui-antipattern.html)
* [Slaying a UI Antipattern in React](https://medium.com/javascript-inside/slaying-a-ui-antipattern-in-react-64a3b98242c)

And here's a list of alternatives

* [react-remote-data](https://github.com/jackfranklin/react-remote-data)

The above approaches are really useful but required me into adopting a flow that
was different from the one I've been working with `redux` and `redux-saga`.
Hence, my reason for creating this library. Do note that, this library only
assumes you have `redux` and let's you use any async pattern you currently have.

## Installation

```bash
npm install @faizaanceg/redux-side-effect --save
```

[Basic Example](https://codesandbox.io/s/pj31myxkq7)

### Basic code snippet

```js
<SideEffect
  startsOn={actionTypes.GET_DATA}
  succeedsOn={actionTypes.GET_DATA_SUCCESS}
  failsOn={actionTypes.GET_DATA_FAILURE}
  render={({ state, errors }) => (
    <>
      {state === "none" && "No action has started yet"}
      {state === "start" && "Loading user info"}
      {state === "success" && "Successfully loaded information"}
      {state === "failure" && errors.message}
    </>
  )}
/>
```

A side effect has the following states:

```js
const SideEffectState = {
  NONE: "none",
  START: "start",
  SUCCESS: "success",
  FAILURE: "failure"
};
```

The `SideEffect` component can listen to action(s) and monitor the status of the
async action as and when you dispatch corresponding actions.

## License

MIT

## TODO

* Add complete documentation
* Add Typescript and Flow definitions
* Add more non-trivial examples
* Write tests (and achieve optimum coverage)

## Contributing

PRs are welcome!
