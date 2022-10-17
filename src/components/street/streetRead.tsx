import { Component } from "react";

import Street from "../../api/street";
import { IStreet } from "../../types/street";

import { Table, Button} from 'react-bootstrap'
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

type Props = {
  streetId: number,
};

type State = {
  street: IStreet,
  errorMsg: string,
};

class StreetRead extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleStreetRead = this.handleStreetRead.bind(this);
    this.state = {
      street: {} as IStreet,
      errorMsg: "",
    };
  }

  componentDidMount() {
    this.handleStreetRead(this.props.streetId);
  }

  async handleStreetRead(streetId: number) {
    let [responseStatus, responseMsg, responseStreet] = await Street.read(this.props.streetId);

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
  }

  render() {
    const { street, errorMsg } = this.state

    return (
      <div className="col-md-12">
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

        {errorMsg && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          </div>
        )}

        {(errorMsg === "") && (
          <div className="form-group">
            <div
              className="alert alert-success"
              role="alert"
            >
              Read successfully
            </div>
          </div>
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

export default function StreetReadWrapper() {
  const { streetId } = useParams();
  return (
      <div>
          <StreetRead streetId={parseInt(streetId as string)} />
      </div>
  );
}