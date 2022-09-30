import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Street from "../../api/street";
import Storage from "../../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table } from 'react-bootstrap'
import { IStreet, IStreetArr } from "../../types/street";


type Props = {};

type State = {
  streets: IStreetArr,
  errorMsg: string,
};

export default class StreetList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleStreetList = this.handleStreetList.bind(this);

    this.state = {
      streets: [],
      errorMsg: "",
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

  render() {
    const { streets, errorMsg } = this.state

    return (
      <div className="col-md-12">
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
          {
            streets.map((street : IStreet) => (
              <tr key={street.id}>
                  <td>{street.userId}</td>
                  <td>{street.name}</td>
                  <td>{street.city}</td>
                  <td>{street.district}</td>
                  <td>{street.postalCode}</td>
                  <td>{street.addressCount}</td>
                  <td>{street.streetLength}</td>
              </tr>
            ))
          }
          </tbody>
        </Table>

        {errorMsg && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {errorMsg}
            </div>
          </div>
        )}
      </div>
    );
  }
}