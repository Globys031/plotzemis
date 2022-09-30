import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Plot from "../../api/plot";
import Storage from "../../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel} from 'react-bootstrap'


type Props = {};

type State = {
  errorMsg: string,
  submitted: boolean,
};

export default class PlotCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handlePlotCreate = this.handlePlotCreate.bind(this);

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
      .required("This field is required!"),
      areaSize: Yup.number()
        .test(
          "interval",
          "Value should be between 1 and 10000",
          (val: any) =>
            val &&
            val >= 1 &&
            val <= 10000
        )
      .required("This field is required!"),
      purpose: Yup.string()
        .test(
          "among",
          "Purpose has to be one of the following: [sandėlis, gyvenamasis, agrikultūrinis, miškininkystės]",
          (val: any) =>
            val &&
            (val.toString().toLowerCase() === "sandėlis" ||
            val.toString().toLowerCase()  === "gyvenamasis" ||
            val.toString().toLowerCase()  === "agrikultūrinis" ||
            val.toString().toLowerCase()  === "miškininkystės")
        )
        .required("This field is required!"),
        type: Yup.string()
        .test(
          "among",
          "Type has to be one of the following: [nuomojamas, parduodamas, neparduodamas]",
          (val: any) =>
            val &&
            (val.toString().toLowerCase() === "nuomojamas" ||
            val.toString().toLowerCase()  === "parduodamas" ||
            val.toString().toLowerCase()  === "neparduodamas")
        )
        .required("This field is required!"),
    });
  }

  async handlePlotCreate(formValue: { streetName: string; lotNo: number; areaSize: number; purpose: string; type: string; }) {
    const { streetName, lotNo, areaSize, purpose, type } = formValue;

    console.log("ieina")

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    // no need for await anymore. this.setState will cause a rerendering.
    let [responseStatus, responseMsg] = await Plot.create(streetName, lotNo, areaSize, purpose, type)

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
    if (responseStatus > 199 && responseStatus < 300) {
      //
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
      areaSize: 0, 
      purpose: "", 
      type: "",
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          {/* used as a hook to initialize form values */}
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handlePlotCreate}
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

              <FormGroup>
                <FloatingLabel controlId="floatingDistrict" label="Area size">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="areaSize" type="number" className="form-control" placeholder="example district" />
                </FloatingLabel>
                <ErrorMessage
                  name="areaSize"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
              <br></br>

              <FormGroup>
                <FloatingLabel controlId="floatingPostalCode" label="Purpose">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="purpose" type="text" className="form-control" placeholder="12345" />
                </FloatingLabel>
                <ErrorMessage
                  name="purpose"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
              <br></br>

              <FormGroup>
                <FloatingLabel controlId="floatingAddressCount" label="Type">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="type" type="text" className="form-control" placeholder="0" />
                </FloatingLabel>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
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
                    Created successfully
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