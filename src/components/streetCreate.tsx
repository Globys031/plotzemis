import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Street from "../api/street";
import Storage from "../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel} from 'react-bootstrap'


type Props = {};

type State = {
  name: string,
  city: string,
  district: string,
  postalCode: string,
  addressCount: number,
  streetLength: string,

  loading: boolean,
  errorMsg: string,
  submitted: boolean,
  notAdmin: boolean,
};

export default class StreetCreate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleStreetCreate = this.handleStreetCreate.bind(this);

    this.state = {
      name: "",
      city: "",
      district: "",
      postalCode: "",
      addressCount: 0,
      streetLength: "",

      loading: false,
      errorMsg: "",
      submitted: false,
      notAdmin: true,
    };
  }

  // If logged in user is admin, he can remove other people's streets
  componentDidMount() {
    const currentUser = Storage.getCurrentUserInfo();

    // Cia dar sugrizt, dabar turetu teisingai json pars'int
    if (currentUser) {
      if (currentUser.role === "ADMIN") {
        this.setState({ notAdmin: false });
      }
    }
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
      postalCode: Yup.string()
        .test(
          "len",
          "The postal code must be 5 characters.",
          (val: any) =>
            val &&
            val.toString().length >= 4 &&
            val.toString().length <= 100
        )
        .required("This field is required!"),
      adressCount: Yup.number()
        .min(1, "There must be at least 1 or more addresses")
        .max(9999, "There must be less than 9999 addresses")
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


  // Register user and output timer that shows when the user will be redirected
  handleStreetCreate(formValue: { name: string; city: string; district: string; postalCode: string; addressCount: number; streetLength: string; }) {
    const { name, city, district, postalCode, addressCount, streetLength } = formValue;

    let successState = false;

    this.setState({
      errorMsg: "",
      submitted: false,
      loading: true,
    });

    // no need for await anymore. this.setState will cause a rerendering.
    let [responseStatus, responseMsg] = Street.create(name, city, district, postalCode, addressCount, streetLength)

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
    if (responseStatus > 199 && responseStatus < 300) {
      successState = true;
    } else {
      this.setState({
        loading: false,
        errorMsg: responseMsg,
      });
    }

    this.setState({
      submitted: true,
    });
  }

  render() {
    const { loading, errorMsg, submitted, notAdmin } = this.state

    const initialValues = {
      name: "",
      city: "",
      district: "",
      postalCode: "",
      addressCount: 0,
      streetLength: "",
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          {/* used as a hook to initialize form values */}
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleStreetCreate}
          >
            {/* acts as an HTML form tag to wrap form controls. */}
            <Form>
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
            </Form>
          </Formik>
        </div>
      </div>
    );
  }
}