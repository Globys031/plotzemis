import { Component } from "react";
import { Link } from "react-router-dom";

import Building from "../../api/building";
import { IBuilding } from "../../types/building";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table, Button} from 'react-bootstrap'
import { useParams } from "react-router-dom";


type Props = {
  streetId: number,
  plotId: number,
  buildingId: number,
};

type State = {
  building: IBuilding,
  errorMsg: string,
  submitted: boolean,
};

class BuildingUpdate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleBuildingUpdate = this.handleBuildingUpdate.bind(this);

    this.state = {
      building: {} as IBuilding,

      errorMsg: "",
      submitted: false,
    };
  }

  async handleBuildingUpdate(formValue: { streetNumber: string; postalCode: string, type: string; areaSize: number; floorCount: number; year: number; price: number; }) {
    const {  streetNumber, postalCode, type, areaSize, floorCount, year, price } = formValue;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    // no need for await anymore. this.setState will cause a rerendering.
    let [responseStatus, responseMsg, responseBuilding] = await Building.update(this.props.streetId, this.props.plotId, this.props.buildingId, streetNumber, postalCode, type, areaSize, floorCount, year, price)

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
    if (responseStatus > 199 && responseStatus < 300) {
      this.setState({
        building: responseBuilding,
      });
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
            onSubmit={this.handleBuildingUpdate}
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
                  <Field name="floorCount" type="number" className="form-control" placeholder="0" />
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
                  <Field name="year" type="number" className="form-control" placeholder="0" />
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
                  <Field name="price" type="number" className="form-control" placeholder="0" />
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
                    Updated successfully
                  </div>
                </div>
              )}


            </Form>
          </Formik>
        </div>

        {building.streetNumber && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Street Id</th>
              <th>Plot Id</th>
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
              <td>{building.streetId}</td>
              <td>{building.plotId}</td>
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

        <Link to={"/building/list/" + this.props.streetId + "/" + this.props.plotId}>
          <Button variant="dark">
            Go back
          </Button>
        </Link>
      </div>
    );
  }
}

export default function BuildingUpdateWrapper() {
  const { streetId, plotId, buildingId } = useParams();
  return (
      <div>
          <BuildingUpdate streetId={parseInt(streetId as string)} plotId={parseInt(plotId as string)} buildingId={parseInt(buildingId as string)}/>
      </div>
  );
}