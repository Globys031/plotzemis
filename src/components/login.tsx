// This page has a Form with username & password
//
// If the verification is ok, we call auth.AuthService.login() method, 
// then direct user to Profile page: this.props.history.push("/profile");, 
// or show message with response error.

import { Component } from "react";
import { Navigate } from "react-router-dom";
import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel} from 'react-bootstrap'
import * as Yup from "yup";

import Authentication from "../auth/grpcMethods";
import {userContext} from '../user/userContext';
import Storage from "../global/userStorage";

type Props = {};

type State = {
  username: string,
  password: string,
  loading: boolean,
  errorMsg: string,
  submitted: boolean,
  redirect: boolean,
};

// https://reactjs.org/docs/components-and-props.html
export default class Login extends Component<Props, State> {
  // Please note that you can't use context in the same component
  // where you use the Context provider because context gets the Context 
  // from its nearest parent.
  static contextType = userContext;
  declare context: React.ContextType<typeof userContext>


  constructor(props: Props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      errorMsg: "",
      submitted: false,
      redirect: false,
    };
  }

  validationSchema() {
    return Yup.object().shape({
      username: Yup.string().required("This field is required!"),
      password: Yup.string().required("This field is required!"),
    });
  }

  async handleLogin(formValue: { username: string; password: string }) {
    const { username, password } = formValue;
    let successState = false;

    // https://reactjs.org/docs/react-component.html#setstate
    // tells React that this component and its children need 
    // to be re-rendered with the updated state.
    this.setState({
      errorMsg: "",
      loading: true,
      submitted: false,
    });

    let [responseStatus, responseMsg] = await Authentication.login(username, password);
    
    if (responseStatus > 199 && responseStatus < 300)  {
      successState = true;
    } else {
      this.setState({
        loading: false,
        errorMsg: responseMsg,
      });
    }

    this.setState({submitted: true})

    // Redirect a couple seconds after successful login
    if (successState === true) {
      setTimeout(() => {
        /*
        Set context from nested child component ("Login" in this case)
        This will trigger rerender'ing of app.tsx, which in turn will trigger
        rerendering of child components encapsulated by userContext.Provider

        After 2 seconds app.tsx will rerender itself as well as its userContext
        child components. App.tsx is set up to load "Profile" component
        if trying to access /login while logged in. This is a work-around
        due to "Navigation" component limitations.
        */
        this.context.setUserState();
      }, 2000);
    }
  }

  render() {
    const { loading, errorMsg, submitted } = this.state;

    const initialValues = {
      username: "",
      password: "",
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleLogin}
          >
            <Form>
              <div>

                <FormGroup>
                  <FloatingLabel controlId="floatingUsername" label="Username">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="username" type="text" className="form-control" placeholder="exampleuser" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="alert alert-danger"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingPassword" label="Password">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="password" type="password" className="form-control" placeholder="examplepassword" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="alert alert-danger"
                  />
                </FormGroup>
                <br></br>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {errorMsg}
                  </div>
                </div>
              )}

              {(errorMsg === "" && submitted) && (
                <div className="form-group">
                  <div
                    className="alert alert-success"
                    role="alert"
                  >
                    Successful login. Redirecting shortly.
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    );
  }
}