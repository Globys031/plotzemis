import { Component } from "react";
import * as Yup from "yup";

import Street from "../../api/street";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Button} from 'react-bootstrap'
import { Link } from "react-router-dom";
import MediaQuery from 'react-responsive'


type Props = {};

type State = {
  errorMsg: string,
  submitted: boolean,
};

export default class StreetCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleStreetCreate = this.handleStreetCreate.bind(this);

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
      city: Yup.string()
        .test(
          "len",
          "The city name must be between 4 and 20 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 4 &&
            val.toString().length <= 20
        )
        .required("This field is required!"),
      district: Yup.string()
        .test(
          "len",
          "The district name must be between 4 and 100 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 4 &&
            val.toString().length <= 100
        )
      .required("This field is required!"),
      addressCount: Yup.number()
        .test(
          "interval",
          "Value should be between 1 and 10000",
          (val: any) =>
            val &&
            val >= 1 &&
            val <= 10000
        )
        .required("This field is required!"),
      streetLength: Yup.string()
        .test(
          "len",
          "The street length must be between 2 and 40 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 2 &&
            val.toString().length <= 40
        )
        .required("This field is required!"),
    });
  }

  async handleStreetCreate(formValue: { name: string; city: string; district: string; addressCount: number; streetLength: string; }) {
    const { name, city, district, addressCount, streetLength } = formValue;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    // no need for await anymore. this.setState will cause a rerendering.
    let [responseStatus, responseMsg] = await Street.create(name, city, district, addressCount, streetLength)

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
      name: "",
      city: "",
      district: "",
      addressCount: 0,
      streetLength: "",
    };

    return (
      <div className="col-md-12">
        <MediaQuery maxWidth={1000}>
          <div className="card card-container-mobile">
            {/* used as a hook to initialize form values */}
            <Formik
              initialValues={initialValues}
              validationSchema={this.validationSchema}
              onSubmit={this.handleStreetCreate}
            >
              {/* acts as an HTML form tag to wrap form controls. */}
              <Form>
                <div>
                <FormGroup>
                  <FloatingLabel controlId="floatingName" label="Name" id="floatingLabel">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="name" type="text" className="form-control form-control-mobile" placeholder="example street name" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="alert alert-danger mobile-font"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingCity" label="City" id="floatingLabel">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="city" type="text" className="form-control form-control-mobile" placeholder="example city name" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="alert alert-danger mobile-font"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingDistrict" label="District" id="floatingLabel">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="district" type="text" className="form-control form-control-mobile" placeholder="example district" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="district"
                    component="div"
                    className="alert alert-danger mobile-font"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingAddressCount" label="AddressCount" id="floatingLabel">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="addressCount" type="number" className="form-control form-control-mobile" placeholder="0" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="addressCount"
                    component="div"
                    className="alert alert-danger mobile-font"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingStreetLength" label="StreetLength" id="floatingLabel">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="streetLength" type="text" className="form-control form-control-mobile" placeholder="about x meters" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="streetLength"
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
                      Created successfully
                    </div>
                  </div>
                )}

                <br></br>
                <div className="form-group-mobile">
                  <Link to={"/street/list"}>
                    <Button variant="dark">
                      Go back
                    </Button>
                  </Link>
                </div>

              </Form>
            </Formik>
          </div>
        </MediaQuery>

        <MediaQuery minWidth={1000}>
          <div className="card card-container">
            {/* used as a hook to initialize form values */}
            <Formik
              initialValues={initialValues}
              validationSchema={this.validationSchema}
              onSubmit={this.handleStreetCreate}
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

                <FormGroup>
                  <FloatingLabel controlId="floatingCity" label="City">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="city" type="text" className="form-control" placeholder="example city name" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="alert alert-danger"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingDistrict" label="District">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="district" type="text" className="form-control" placeholder="example district" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="district"
                    component="div"
                    className="alert alert-danger"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingAddressCount" label="AddressCount">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="addressCount" type="number" className="form-control" placeholder="0" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="addressCount"
                    component="div"
                    className="alert alert-danger"
                  />
                </FormGroup>
                <br></br>

                <FormGroup>
                  <FloatingLabel controlId="floatingStreetLength" label="StreetLength">
                    {/* A placeholder is required on each <Form.Control> */}
                    <Field name="streetLength" type="text" className="form-control" placeholder="about x meters" />
                  </FloatingLabel>
                  <ErrorMessage
                    name="streetLength"
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

                <br></br>
                <div className="form-group">
                  <Link to={"/street/list"}>
                    <Button variant="dark">
                      Go back
                    </Button>
                  </Link>
                </div>

              </Form>
            </Formik>
          </div>
        </MediaQuery>

      </div>
    );
  }
}

// export default function StreetCreateWrapper() {
//   const isMobile = useMediaQuery({ maxWidth: 767 })
//   return (
//       <div>
//           <StreetCreate isMobile={isMobile ? true : false}/>
//       </div>
//   );
// }