import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Authentication from "../auth/grpcMethods";
import Storage from "../global/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel} from 'react-bootstrap'


type Props = {};

type State = {
  username: string,
  email: string,
  loading: boolean,
  password: string,
  errorMsg: string,
  submitted: boolean,
  redirect: boolean,
  notAdmin: boolean,
};

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      username: "",
      email: "",
      loading: false,
      password: "",
      errorMsg: "",
      submitted: false,
      redirect: false,
      notAdmin: true,
    };
  }

  // Only show user role selection buttons if logged in user is an admin
  componentDidMount() {
    const currentUser = Storage.getCurrentUserInfo();

    // Cia dar sugrizt, dabar turetu teisingai json pars'int
    if (currentUser) {
      if (currentUser.getRole() === "ADMIN") {
        this.setState({ notAdmin: false });
      }
    }
  }

  validationSchema() {
    return Yup.object().shape({
      username: Yup.string()
        .test(
          "len",
          "The username must be between 6 and 20 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 6 &&
            val.toString().length <= 20
        )
        .required("This field is required!"),
      email: Yup.string()
        .email("This is not a valid email.")
        .required("This field is required!"),
      password: Yup.string()
        .test(
          "len",
          "The password must be between 8 and 40 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 8 &&
            val.toString().length <= 40
        )
        .required("This field is required!"),
      role: Yup.string()
        .test(
          "role",
          "Role must be one of these three: USER, MOD or ADMIN",
          (val: any) =>
            val &&
            (val.toString() === "USER" ||
            val.toString() === "MOD" ||
            val.toString() === "ADMIN")
        )
        .required("This field is required!"),
    });
  }

  // Register user and output timer that shows when the user will be redirected
  async handleRegister(formValue: { username: string; email: string; password: string; role: string }) {
    const { username, email, password, role } = formValue;

    let successState = false;

    this.setState({
      errorMsg: "",
      submitted: false,
      loading: true,
    });

    console.log("ieina")
    let [responseStatus, responseMsg] = await Authentication.register(username, email, password, role)
    console.log("ciuju neiseina")

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
    // If registration was successful, treat the user as logged in
    if (responseStatus > 199 && responseStatus < 300) {
      successState = true;
    } else {
      this.setState({
        loading: false,
        errorMsg: responseMsg,
      });
    }

    this.setState({
      submitted: true,
    });

    // Redirect a couple seconds after successful registration
    if (successState === true) {
      setTimeout(() => {
        this.setState({redirect: true});
      }, 2000);
    }
  }

  render() {
    const { loading, errorMsg, submitted, redirect, notAdmin } = this.state;

    const initialValues = {
      username: "",
      email: "",
      password: "",
      // by default create regular user if a different type isn't selected
      // only admin user can select other roles when creating user
      role: "USER",
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          {/* used as a hook to initialize form values */}
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleRegister}
          >
            {/* acts as an HTML form tag to wrap form controls. */}
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
                <FloatingLabel controlId="floatingEmail" label="Email">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="email" type="email" className="form-control" placeholder="example@email.com" />
                </FloatingLabel>
                <ErrorMessage
                  name="email"
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

              {/* Bootstrap react components interfere with formik*/}
              {/* <Field component={FormSelect} name="role"> */}
              <Field as="select" className="form-select" name="role" hidden={notAdmin}>
                <option>Select user role</option>
                <option value="USER">Regular user</option>
                <option value="MOD">Moderator</option>
                <option value="ADMIN">Administrator</option>
              </Field>
              <ErrorMessage
                  name="role"
                  component="div"
                  className="alert alert-danger"
                />
              <br hidden={notAdmin}></br>

                <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                    {loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Sign up</span>
                  </button>
                </div>

              </div>

              {errorMsg && (
                <div className="form-group">
                  <div
                    className="alert alert-danger"
                    role="alert"
                  >
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
                    Successful registration. Redirecting shortly.
                  </div>
                </div>
              )}
              {/* redirect a couple seconds after successful registration */}
              {(redirect) && (
                <Navigate to="/login"></Navigate>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    );
  }
}