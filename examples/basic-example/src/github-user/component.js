import { EffectType, useSideEffect } from "@faizaanceg/redux-side-effect";
import { Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { actions, actionTypes } from "./ducks";

let mapDispatchToProps = actions;

let mapStateToProps = state => state.github;

function GithubUser(props) {
  const { user } = props;
  let [{ state, isFetching, errors }] = useSideEffect({
    startsOn: actionTypes.GET_GITHUB_USER
  });
  return (
    <>
      <Formik
        initialValues={{
          username: ""
        }}
        enableReinitialize
        onSubmit={props.getUserThunk}
        render={() => (
          <Form>
            <div>
              <Field
                type="text"
                name="username"
                title="Username missing"
                placeholder="Enter Github username"
                required
              />
            </div>
            <button type="submit" disabled={isFetching}>
              Search
            </button>
          </Form>
        )}
      />
      {isFetching && "Loading user info"}
      {state === EffectType.SUCCESS && <div>{user.name}</div>}
      {state === EffectType.FAILURE && errors.message}
    </>
  );
}

GithubUser.propTypes = {
  user: PropTypes.object,
  getUserThunk: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(GithubUser);
