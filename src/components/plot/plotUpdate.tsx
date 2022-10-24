import { Component } from "react";
import { Link } from "react-router-dom";

import Plot from "../../api/plot";
import { IPlot } from "../../types/plot";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table, Button} from 'react-bootstrap'
import { useParams } from "react-router-dom";
import MediaQuery from 'react-responsive'


type Props = {
  streetId: number,
  plotId: number,
};

type State = {
  plot: IPlot,
  errorMsg: string,
  submitted: boolean,
};

class PlotUpdate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handlePlotUpdate = this.handlePlotUpdate.bind(this);

    this.state = {
      plot: {} as IPlot,

      errorMsg: "",
      submitted: false,
    };
  }

  async handlePlotUpdate(formValue: { lotNo: number; areaSize: number; purpose: string; type: string; }) {
    const { lotNo, areaSize, purpose, type } = formValue;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    // no need for await anymore. this.setState will cause a rerendering.
    let [responseStatus, responseMsg, responsePlot] = await Plot.update(this.props.streetId, this.props.plotId, lotNo, areaSize, purpose, type);

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
    if (responseStatus > 199 && responseStatus < 300) {
      this.setState({
        plot: responsePlot,
      });
    } else {
      this.setState({
        plot: responsePlot,
        errorMsg: responseMsg,
      });
    }

    this.setState({
      submitted: true,
    });
  }

  render() {
    const { errorMsg, submitted, plot } = this.state

    const initialValues = {
      lotNo: 0,
      areaSize: 0, 
      purpose: "", 
      type: "",
    };

    return (
      <div className="col-md-12">
        <MediaQuery maxWidth={1000}>
          <div className="card card-container-mobile">
            {/* used as a hook to initialize form values */}
            <Formik
              initialValues={initialValues}
              onSubmit={this.handlePlotUpdate}
            >
              {/* acts as an HTML form tag to wrap form controls. */}
              <Form>
                <div>
                <FormGroup>
                  <FloatingLabel controlId="floatingCity" label="Lot No." id="floatingLabel">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="lotNo" type="number" className="form-control form-control-mobile" placeholder="example city name" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="lotNo"
                    component="div"
                    className="alert alert-danger mobile-font"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingDistrict" label="Area size" id="floatingLabel">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="areaSize" type="number" className="form-control form-control-mobile" placeholder="example district" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="areaSize"
                    component="div"
                    className="alert alert-danger mobile-font"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingPostalCode" label="Purpose" id="floatingLabel">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="purpose" type="text" className="form-control form-control-mobile" placeholder="12345" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="purpose"
                    component="div"
                    className="alert alert-danger mobile-font"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingAddressCount" label="Type" id="floatingLabel">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="type" type="number" className="form-control form-control-mobile" placeholder="0" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="alert alert-danger mobile-font"
                  />
                </FormGroup>
                <br></br>

                <div className="form-group-mobile">
                    <button type="submit" className="btn btn-primary btn-block">
                      Submit
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="form-group-mobile">
                    <div className="alert alert-danger" role="alert">
                      {errorMsg}
                    </div>
                  </div>
                )}

                {(errorMsg === "" && submitted) && (
                  <div className="form-group-mobile">
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

          {plot.type && (
          <Table striped bordered hover responsive className="mobile-font">
            <thead>
              <tr>
              <th>User Id</th>
                <th>Street Id</th>
                <th>Lot number</th>
                <th>Area size</th>
                <th>Purpose</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
                <tr key={plot.id}>
                <td>{plot.userId}</td>
                <td>{plot.streetId}</td>
                <td>{plot.lotNo}</td>
                <td>{plot.areaSize}</td>
                <td>{plot.purpose}</td>
                <td>{plot.type}</td>
            </tr>
            </tbody>
          </Table>
          )}

          <br></br>
          <div className="form-group-mobile">
            <Link to={"/plot/list/" + this.props.streetId}>
              <Button variant="dark">
                Go back
              </Button>
            </Link>
          </div>
        </MediaQuery>

        <MediaQuery minWidth={1000}>
          <div className="card card-container">
            {/* used as a hook to initialize form values */}
            <Formik
              initialValues={initialValues}
              onSubmit={this.handlePlotUpdate}
            >
              {/* acts as an HTML form tag to wrap form controls. */}
              <Form>
                <div>
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
                    <Field name="type" type="number" className="form-control" placeholder="0" />
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
                      Updated successfully
                    </div>
                  </div>
                )}


              </Form>
            </Formik>
          </div>

          {plot.type && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
              <th>User Id</th>
                <th>Street Id</th>
                <th>Lot number</th>
                <th>Area size</th>
                <th>Purpose</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
                <tr key={plot.id}>
                <td>{plot.userId}</td>
                <td>{plot.streetId}</td>
                <td>{plot.lotNo}</td>
                <td>{plot.areaSize}</td>
                <td>{plot.purpose}</td>
                <td>{plot.type}</td>
            </tr>
            </tbody>
          </Table>
          )}

          <br></br>
          <div className="form-group">
            <Link to={"/plot/list/" + this.props.streetId}>
              <Button variant="dark">
                Go back
              </Button>
            </Link>
          </div>
        </MediaQuery>

      </div>
    );
  }
}

export default function PlotUpdateWrapper() {
  const { streetId, plotId } = useParams();
  return (
      <div>
          <PlotUpdate 
            streetId={parseInt(streetId as string)} 
            plotId={parseInt(plotId as string)}
          />
      </div>
  );
}