import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Building from "../../api/building";
import Storage from "../../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel} from 'react-bootstrap'


type Props = {};

type State = {
  errorMsg: string,
  submitted: boolean,
};

export default class BuildingCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleBuildingCreate = this.handleBuildingCreate.bind(this);

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
      streetNumber: Yup.string()
      .test(
        "len",
        "The street number name must be between 1 and 10 characters.",
        (val: any) =>
          val &&
          val.toString().length >= 1 &&
          val.toString().length <= 10
      )
      .required("This field is required!"),
      type: Yup.string()
      .test(
        "len",
        "The street number name must be between 3 and 20 characters.",
        (val: any) =>
          val &&
          val.toString().length >= 3 &&
          val.toString().length <= 20
      )
      .required("This field is required!"),
      areaSize: Yup.number()
      .test(
        "len",
        "Value should be between 1 and 999998",
        (val: any) =>
          val &&
          val > 0 &&
          val < 999999
      )
      .required("This field is required!"),
      floorCount: Yup.number()
      .test(
        "len",
        "Value should be between 0 and 99",
        (val: any) =>
          val &&
          val >= 0 &&
          val < 99
      )
      .required("This field is required!"),
      year: Yup.number()
      .test(
        "len",
        "Value should be between 1500 and 2050",
        (val: any) =>
          val &&
          val > 1500 &&
          val < 2050
      )
      .required("This field is required!"),
      price: Yup.number()
      .test(
        "len",
        "Value should be between 1 and 999999999",
        (val: any) =>
          val &&
          val > 0 &&
          val < 999999999
      )
      .required("This field is required!"),
    });
  }

  async handleBuildingCreate(formValue: { streetName: string; lotNo: number; streetNumber: string; type: string; areaSize: number; floorCount: number; year: number; price: number }) {
    const { streetName, lotNo, streetNumber, type, areaSize, floorCount, year, price } = formValue;

    let successState = false;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    // no need for await anymore. this.setState will cause a rerendering.
    let [responseStatus, responseMsg] = await Building.create(streetName, lotNo, streetNumber, type, areaSize, floorCount, year, price)

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
    if (responseStatus > 199 && responseStatus < 300) {
      successState = true;
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
      streetNumber: "",
      type: "",
      areaSize: 0,
      floorCount: 0,
      year: 0,
      price: 0,
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          {/* used as a hook to initialize form values */}
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleBuildingCreate}
          >
            {/* acts as an HTML form tag to wrap form controls. */}
            <Form>
              <div>
              <FormGroup>
                <FloatingLabel controlId="floatingName" label="Street name">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="streetName" type="text" className="form-control" placeholder="example building name" />
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
                <FloatingLabel controlId="floatingDistrict" label="Street number">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="streetNumber" type="text" className="form-control" placeholder="example district" />
                </FloatingLabel>
                <ErrorMessage
                  name="streetNumber"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
              <br></br>

              <FormGroup>
                <FloatingLabel controlId="floatingPostalCode" label="Type">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="type" type="text" className="form-control" placeholder="12345" />
                </FloatingLabel>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
              <br></br>


              <FormGroup>
                <FloatingLabel controlId="floatingAddressCount" label="Area size">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="areaSize" type="number" className="form-control" placeholder="0" />
                </FloatingLabel>
                <ErrorMessage
                  name="areaSize"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
              <br></br>

              <FormGroup>
                <FloatingLabel controlId="floatingBuildingLength" label="Floor count">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="floorCount" type="number" className="form-control" placeholder="" />
                </FloatingLabel>
                <ErrorMessage
                  name="floorCount"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
              <br></br>

              <FormGroup>
                <FloatingLabel controlId="floatingBuildingLength" label="Year">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="year" type="number" className="form-control" placeholder="" />
                </FloatingLabel>
                <ErrorMessage
                  name="year"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
              <br></br>

              <FormGroup>
                <FloatingLabel controlId="floatingBuildingLength" label="Price">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="price" type="number" className="form-control" placeholder="" />
                </FloatingLabel>
                <ErrorMessage
                  name="price"
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