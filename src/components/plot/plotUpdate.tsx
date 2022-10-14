import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Plot from "../../api/plot";
import Storage from "../../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table} from 'react-bootstrap'

import { IPlot } from "../../types/plot";


type Props = {};

type State = {
  plot: IPlot,

  errorMsg: string,
  submitted: boolean,
};

export default class PlotUpdate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handlePlotUpdate = this.handlePlotUpdate.bind(this);

    this.state = {
      plot: {} as IPlot,

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

  async handlePlotUpdate(formValue: { streetName: string; lotNo: number; areaSize: number; purpose: string; type: string; }) {
    const { streetName, lotNo, areaSize, purpose, type } = formValue;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    // no need for await anymore. this.setState will cause a rerendering.
    let [responseStatus, responseMsg, responsePlot] = await Plot.update(streetName, lotNo, areaSize, purpose, type)

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
            onSubmit={this.handlePlotUpdate}
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

        {plot.streetName && (
        <Table striped bordered hover>
          <thead>
            <tr>
            <th>User Id</th>
              <th>Street name</th>
              <th>Lot number</th>
              <th>Area size</th>
              <th>Purpose</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
              <tr key={plot.id}>
              <td>{plot.userId}</td>
              <td>{plot.streetName}</td>
              <td>{plot.lotNo}</td>
              <td>{plot.areaSize}</td>
              <td>{plot.purpose}</td>
              <td>{plot.type}</td>
          </tr>
          </tbody>
        </Table>
        )}
      </div>
    );
  }
}