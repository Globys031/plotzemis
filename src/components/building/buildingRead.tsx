import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Building from "../../api/building";
import Storage from "../../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table} from 'react-bootstrap'

import { IBuilding } from "../../types/building";


type Props = {};

type State = {
  building: IBuilding,

  errorMsg: string,
  submitted: boolean,
};

export default class BuildingRead extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleBuildingRead = this.handleBuildingRead.bind(this);

    this.state = {
      building: {} as IBuilding,

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
    });
  }

  async handleBuildingRead(formValue: { streetName: string; lotNo: number; streetNumber: string; }) {
    const { streetName, lotNo, streetNumber } = formValue;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    let [responseStatus, responseMsg, responseBuilding] = await Building.read(streetName, lotNo, streetNumber);

    console.log()
    if (responseStatus > 199 && responseStatus < 300) {
      this.setState({
        building: responseBuilding,
      });
      // will rewrite it properly later
    } else {
      this.setState({
        building: responseBuilding,
        errorMsg: responseMsg,
      });
    }
    this.setState({
      submitted: true,
    });
  }

  render() {
    const { errorMsg, submitted, building } = this.state
    
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
            onSubmit={this.handleBuildingRead}
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
                    Read successfully
                  </div>
                </div>
              )}


            </Form>
          </Formik>
        </div>

        {building.streetName && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Street name</th>
              <th>Lot No.</th>
              <th>Street number</th>
              <th>Type</th>
              <th>Area size</th>
              <th>Floor count</th>
              <th>Year</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
              <tr key={building.id}>
              <td>{building.userId}</td>
              <td>{building.streetName}</td>
              <td>{building.lotNo}</td>
              <td>{building.streetNumber}</td>
              <td>{building.type}</td>
              <td>{building.areaSize}</td>
              <td>{building.floorCount}</td>
              <td>{building.year}</td>
              <td>{building.price}</td>
          </tr>
          </tbody>
        </Table>
        )}
      </div>
    );
  }
}