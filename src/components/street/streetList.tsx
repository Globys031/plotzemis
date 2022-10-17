import { Component } from "react";

import Street from "../../api/street";

import { Table, Button } from 'react-bootstrap'
import { IStreet, IStreetArr } from "../../types/street";
import { Link } from "react-router-dom";

type Props = {
  loggedIn: boolean
};

type State = {
  streets: IStreetArr,
  errorMsg: string,

  submittedRemove: boolean,
  isLoadingRemove: boolean,
};

export default class StreetList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleStreetList = this.handleStreetList.bind(this);

    this.state = {
      streets: [],
      errorMsg: "",

      submittedRemove: false,
      isLoadingRemove: false,
    };
  }

  componentDidMount() {
    this.handleStreetList();
  }

  async handleStreetList() {
    let [responseStatus, responseMsg, responseStreets] = await Street.list();

    if (responseStatus > 199 && responseStatus < 300) {
      this.setState({
        streets: responseStreets
      });
      // veliau perrasysiu normaliai
    } else {
      this.setState({
        errorMsg: responseMsg,
      });
    }
  }

  async handleStreetRemove(streetId: number) {
    this.setState({
      errorMsg: "",
      submittedRemove: false,
      isLoadingRemove: true,
    });

    let [responseStatus, responseMsg] = await Street.remove(streetId);

    if (responseStatus > 199 && responseStatus < 300) {
      // will rewrite it properly later
    } else {
      this.setState({
        errorMsg: responseMsg,
      });
    }
    this.handleStreetList();
    this.setState({
      submittedRemove: true,
      isLoadingRemove: false,
    });
  }
  
  // handleClickRead = () => this.setState({isLoadingRead: !this.state.isLoadingRead})
  // handleClickUpdate = () => this.setState({isLoadingUpdate: !this.state.isLoadingUpdate})
  // handleClickRemove = () => this.setState({isLoadingRemove: !this.state.isLoadingRemove})

  render() {
    const { streets, errorMsg, isLoadingRemove, submittedRemove } = this.state

    return (
      <div className="col-md-12">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Street Id</th>
              <th>User Id</th>
              <th>Street name</th>
              <th>City</th>
              <th>District</th>
              <th>Address Count</th>
              <th>Street Length</th>
              <th colSpan={5}>Actions</th>
            </tr>
          </thead>
          <tbody>
          {
            streets.map((street : IStreet) => (
              <tr key={street.id}>
                  <td>{street.id}</td>
                  <td>{street.userId}</td>
                  <td>{street.name}</td>
                  <td>{street.city}</td>
                  <td>{street.district}</td>
                  <td>{street.addressCount}</td>
                  <td>{street.streetLength}</td>
                  <td>
                    <Link to={"/plot/list/" + street.id}>
                      <Button variant="dark">
                        List plots
                      </Button>
                    </Link>
                  </td>
                  {this.props.loggedIn && (
                    <td>
                      <Link to={"/plot/create/" + street.id}>
                        <Button variant="dark">
                          Add plot
                        </Button>
                      </Link>
                    </td>
                  )}
                  <td>
                    <Link to={"/street/read/" + street.id}>
                      <Button variant="dark">
                        Read street
                      </Button>
                    </Link>
                  </td>
                  {this.props.loggedIn && (
                    <td>
                      <Button
                        variant="dark"
                        disabled={isLoadingRemove}
                        // onClick={this.handleStreetRemove(street.id)}
                        onClick={() => this.handleStreetRemove(street.id)}
                      >
                        {isLoadingRemove ? 'Loading…' : 'Remove street'}
                      </Button>
                    </td>
                  )}
                  {this.props.loggedIn && (
                    <td>
                      <Link to={"/street/update/" + street.id}>
                        <Button variant="dark">
                          Update street
                        </Button>
                      </Link>
                    </td>
                  )}
              </tr>
            ))
          }
          </tbody>
        </Table>

        {this.props.loggedIn && (
          <Link to={"/street/create"}>
            <Button variant="primary">
              Add new street
            </Button>
          </Link>
        )}

        {errorMsg && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          </div>
        )}

        {(errorMsg === "" && submittedRemove) && (
          <div className="form-group">
            <div
              className="alert alert-success"
              role="alert"
            >
              Removed successfully
            </div>
          </div>
        )}

      </div>
    );
  }
}