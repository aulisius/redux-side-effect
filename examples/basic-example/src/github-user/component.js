import { Effect } from "@faizaanceg/redux-side-effect";
import { Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import SideEffect from "../side-effect";
import { actions, actionTypes } from "./ducks";

class GithubUser extends Component {
  static mapDispatchToProps = actions;

  static mapStateToProps = state => state.github;

  static propTypes = {
    user: PropTypes.object,
    getUserThunk: PropTypes.func
  };

  render() {
    const { user } = this.props;
    return (
      <SideEffect
        startsOn={actionTypes.GET_GITHUB_USER}
        render={({ state, isFetching, errors }) => (
          <Fragment>
            <Formik
              initialValues={{
                username: ""
              }}
              enableReinitialize
              onSubmit={this.props.getUserThunk}
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
            {state === Effect.SUCCESS && user.name}
            {state === Effect.FAILURE && errors.message}
          </Fragment>
        )}
      />
    );
  }
}

export default connect(
  GithubUser.mapStateToProps,
  GithubUser.mapDispatchToProps
)(GithubUser);
