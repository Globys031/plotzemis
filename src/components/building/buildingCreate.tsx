import { Component } from "react";
import * as Yup from "yup";

import Building from "../../api/building";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Button} from 'react-bootstrap'
import { Link, useParams } from "react-router-dom";


type Props = {
  streetId: number,
  plotId: number,
};

type State = {
  errorMsg: string,
  submitted: boolean,
};

class BuildingCreate extends Component<Props, State> {
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
        "The type name must be between 3 and 20 characters.",
        (val: any) =>
          val &&
          val.toString().length >= 3 &&
          val.toString().length <= 20
      )
      .required("This field is required!"),
      postalCode: Yup.string()
      .test(
        "len",
        "The postal code must be 5 characters.",
        (val: any) =>
          val &&
          val.toString().length === 5
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
          val > 1 &&
          val < 999999999
      )
      .required("This field is required!"),
    });
  }

  async handleBuildingCreate(formValue: { streetNumber: string; postalCode: string; type: string; areaSize: number; floorCount: number; year: number; price: number }) {
    const { streetNumber, postalCode, type, areaSize, floorCount, year, price } = formValue;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    let [responseStatus, responseMsg] = await Building.create(this.props.streetId, this.props.plotId, streetNumber, postalCode, type, areaSize, floorCount, year, price);

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
      streetNumber: "",
      postalCode: "",
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
                <FloatingLabel controlId="floatingPostalCode" label="PostalCode">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="postalCode" type="text" className="form-control" placeholder="12345" />
                </FloatingLabel>
                <ErrorMessage
                  name="postalCode"
                  component="div"
                  className="alert alert-danger"
                />
              </FormGroup>
              <br></br>

              <FormGroup>
                <FloatingLabel controlId="floatingType" label="Type">
                  {/* A placeholder is required on each <Form.Control> */}
                  <Field name="type" type="text" className="form-control" placeholder="apartment" />
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

              <Link to={"/building/list/" + this.props.streetId + "/" + this.props.plotId}>
                <Button variant="dark">
                  Go back
                </Button>
              </Link>

            </Form>
          </Formik>
        </div>
      </div>
    );
  }
}

export default function BuildingCreateWrapper() {
  const { streetId, plotId } = useParams();
  return (
      <div>
          <BuildingCreate streetId={parseInt(streetId as string)} plotId={parseInt(plotId as string)}/>
      </div>
  );
}