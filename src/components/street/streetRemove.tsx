import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Street from "../../api/street";
import Storage from "../../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table} from 'react-bootstrap'

import { IStreet } from "../../types/street";
import street from "../../api/street";


type Props = {};

type State = {
  errorMsg: string,
  submitted: boolean,
};

export default class StreetRemove extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleStreetRemove = this.handleStreetRemove.bind(this);

    this.state = {
      errorMsg: "",
      submitted: false,
    };
  }

  validationSchema() {
    return Yup.object().shape({
      name: Yup.string()
        .test(
          "len",
          "The street name must be between 4 and 100 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 4 &&
            val.toString().length <= 100
        )
        .required("This field is required!"),
    });
  }

  async handleStreetRemove(formValue: { name: string; }) {
    const { name } = formValue;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    // If logged in user is admin, he can remove other people's streets
    const currentUser = Storage.getCurrentUserInfo();
    let notAdmin: boolean = true;
    if (currentUser) {
      if (currentUser.role === "ADMIN") {
        notAdmin = false
      }
    }
    let [responseStatus, responseMsg] = await Street.remove(name, notAdmin);

    if (responseStatus > 199 && responseStatus < 300) {
      // will rewrite it properly later
    } else {
      this.setState({
        errorMsg: responseMsg,
      });
    }
    this.setState({
      submitted: true,
    });
  }

  render() {
    const { errorMsg, submitted } = this.state

    const initialValues = {
      name: "",
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          {/* used as a hook to initialize form values */}
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleStreetRemove}
          >
            {/* acts as an HTML form tag to wrap form controls. */}
            <Form>
              <div>
              <FormGroup>
                <FloatingLabel controlId="floatingName" label="Name">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="name" type="text" className="form-control" placeholder="example street name" />
                </FloatingLabel>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
              <br></br>
              <br></br>

              <div className="form-group">
                  <button type="submit" className="btn btn-primary btn-block">
                    Submit
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
                    Removed successfully
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