import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Street from "../../api/street";
import Storage from "../../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table} from 'react-bootstrap'

import { IStreet } from "../../types/street";


type Props = {};

type State = {
  street: IStreet,

  errorMsg: string,
  submitted: boolean,
};

export default class StreetRead extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleStreetRead = this.handleStreetRead.bind(this);

    this.state = {
      street: {} as IStreet,

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
    });
  }

  async handleStreetRead(formValue: { name: string; }) {
    const { name } = formValue;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    let [responseStatus, responseMsg, responseStreet] = await Street.read(name);

    console.log()
    if (responseStatus > 199 && responseStatus < 300) {
      this.setState({
        street: responseStreet,
      });
      // will rewrite it properly later
    } else {
      this.setState({
        street: responseStreet,
        errorMsg: responseMsg,
      });
    }
    this.setState({
      submitted: true,
    });
  }

  render() {
    const { errorMsg, submitted, street } = this.state
    
    const initialValues = {
      name: "",
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          {/* used as a hook to initialize form values */}
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleStreetRead}
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

        {street.name && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Street name</th>
              <th>City</th>
              <th>District</th>
              <th>Postal Code</th>
              <th>Address Count</th>
              <th>Street Length</th>
            </tr>
          </thead>
          <tbody>
              <tr key={street.id}>
              <td>{street.userId}</td>
              <td>{street.name}</td>
              <td>{street.city}</td>
              <td>{street.district}</td>
              <td>{street.postalCode}</td>
              <td>{street.addressCount}</td>
              <td>{street.streetLength}</td>
          </tr>
          </tbody>
        </Table>
        )}
      </div>
    );
  }
}