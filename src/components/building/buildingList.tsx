import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Building from "../../api/building";
import Storage from "../../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table } from 'react-bootstrap'
import { IBuilding, IBuildingArr } from "../../types/building";


type Props = {};

type State = {
  buildings: IBuildingArr,
  errorMsg: string,
};

export default class BuildingList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleBuildingList = this.handleBuildingList.bind(this);

    this.state = {
      buildings: [],
      errorMsg: "",
    };
  }

  componentDidMount() {
    this.handleBuildingList();
  }

  async handleBuildingList() {
    let [responseStatus, responseMsg, responseBuildings] = await Building.list();

    if (responseStatus > 199 && responseStatus < 300) {
      this.setState({
        buildings: responseBuildings
      });
      // veliau perrasysiu normaliai
    } else {
      this.setState({
        errorMsg: responseMsg,
      });
    }
  }

  render() {
    const { buildings, errorMsg } = this.state

    return (
      <div className="col-md-12">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Street name</th>
              <th>Lot No.</th>
              <th>Street number</th>
              <th>Type</th>
              <th>Area size</th>
              <th>Floor count</th>
              <th>Year</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
          {
            buildings.map((building : IBuilding) => (
              <tr key={building.id}>
                  <td>{building.userId}</td>
                  <td>{building.streetName}</td>
                  <td>{building.lotNo}</td>
                  <td>{building.streetNumber}</td>
                  <td>{building.type}</td>
                  <td>{building.areaSize}</td>
                  <td>{building.floorCount}</td>
                  <td>{building.year}</td>
                  <td>{building.price}</td>
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