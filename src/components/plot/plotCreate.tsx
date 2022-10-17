import { Component } from "react";
import * as Yup from "yup";

import Plot from "../../api/plot";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Button} from 'react-bootstrap'
import { Link, useParams } from "react-router-dom";


type Props = {
  streetId: number,
};

type State = {
  errorMsg: string,
  submitted: boolean,
};

class PlotCreate extends Component<Props, State> {
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

  async handlePlotCreate(formValue: { lotNo: number; areaSize: number; purpose: string; type: string; }) {
    const { lotNo, areaSize, purpose, type } = formValue;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    let [responseStatus, responseMsg] = await Plot.create(this.props.streetId, lotNo, areaSize, purpose, type);

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

              <Link to={"/plot/list/" + this.props.streetId}>
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

export default function PlotCreateWrapper() {
  const { streetId } = useParams();
  return (
      <div>
          <PlotCreate streetId={parseInt(streetId as string)}/>
      </div>
  );
}