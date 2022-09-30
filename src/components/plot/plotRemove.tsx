import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Plot from "../../api/plot";
import Storage from "../../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table} from 'react-bootstrap'

import { IPlot } from "../../types/plot";
import plot from "../../api/plot";


type Props = {};

type State = {
  errorMsg: string,
  submitted: boolean,
};

export default class PlotRemove extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handlePlotRemove = this.handlePlotRemove.bind(this);

    this.state = {
      errorMsg: "",
      submitted: false,
    };
  }

  validationSchema() {
    return Yup.object().shape({
      streetName: Yup.string()
        .test(
          "len",
          "The building name must be between 4 and 100 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 4 &&
            val.toString().length <= 100
        )
        .required("This field is required!"),
      lotNo: Yup.number()
      .test(
        "interval",
        "Value should be between 1 and 99999",
        (val: any) =>
          val &&
          val >= 1 &&
          val <= 99999
      )
    });
  }

  async handlePlotRemove(formValue: { streetName: string; lotNo: number; }) {
    const { streetName, lotNo } = formValue;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    // If logged in user is admin, he can remove other people's plots
    const currentUser = Storage.getCurrentUserInfo();
    let notAdmin: boolean = true;
    if (currentUser) {
      if (currentUser.role === "ADMIN") {
        notAdmin = false
      }
    }
    let [responseStatus, responseMsg] = await Plot.remove(streetName, lotNo, notAdmin);

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
      streetName: "", 
      lotNo: 0,
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          {/* used as a hook to initialize form values */}
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handlePlotRemove}
          >
            {/* acts as an HTML form tag to wrap form controls. */}
            <Form>
              <div>
              <FormGroup>
                <FloatingLabel controlId="floatingName" label="Street name">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="streetName" type="text" className="form-control" placeholder="example plot name" />
                </FloatingLabel>
                <ErrorMessage
                  name="streetName"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
              <br></br>

              <FormGroup>
                <FloatingLabel controlId="floatingCity" label="Lot No.">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="lotNo" type="number" className="form-control" placeholder="example city name" />
                </FloatingLabel>
                <ErrorMessage
                  name="lotNo"
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