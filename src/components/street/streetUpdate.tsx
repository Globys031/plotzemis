import { Component } from "react";
import { Link } from "react-router-dom";

import Street from "../../api/street";
import { IStreet } from "../../types/street";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table, Button} from 'react-bootstrap'
import { useParams } from "react-router-dom";

type Props = {
  streetId: number,
};

type State = {
  street: IStreet,
  errorMsg: string,
  submitted: boolean,
};

class StreetUpdate extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleStreetUpdate = this.handleStreetUpdate.bind(this);

    this.state = {
      street: {} as IStreet,

      errorMsg: "",
      submitted: false,
    };
  }

  async handleStreetUpdate(formValue: { name: string; city: string; district: string; addressCount: number; streetLength: string; }) {
    const { name, city, district, addressCount, streetLength } = formValue;


    let successState = false;

    this.setState({
      errorMsg: "",
      submitted: false,
    });

    let [responseStatus, responseMsg, responseStreet] = await Street.update(this.props.streetId, name, city, district, addressCount, streetLength)

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#server_error_responses
    if (responseStatus > 199 && responseStatus < 300) {
      this.setState({
        street: responseStreet,
      });
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
      city: "",
      district: "",
      addressCount: 0,
      streetLength: "",
    };

    return (
      <div className="col-md-12">
        <div className="card card-container">
          {/* used as a hook to initialize form values */}
          <Formik
            initialValues={initialValues}
            onSubmit={this.handleStreetUpdate}
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
                    Updated successfully
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>

        {street.name && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Street name</th>
              <th>City</th>
              <th>District</th>
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
              <td>{street.addressCount}</td>
              <td>{street.streetLength}</td>
          </tr>
          </tbody>
        </Table>
        )}

        <Link to={"/street/list"}>
          <Button variant="dark">
            Go back
          </Button>
        </Link>
      </div>
    );
  }
}

export default function StreetUpdateWrapper() {
  const { streetId } = useParams();
  return (
      <div>
          <StreetUpdate streetId={parseInt(streetId as string)} />
      </div>
  );
}