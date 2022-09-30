import { Component } from "react";
import { Navigate } from "react-router-dom";
import * as Yup from "yup";

import Plot from "../../api/plot";
import Storage from "../../user/userStorage";

import { Form, Formik, ErrorMessage, Field } from "formik";
import { FormGroup, FloatingLabel, Table } from 'react-bootstrap'
import { IPlot, IPlotArr } from "../../types/plot";


type Props = {};

type State = {
  plots: IPlotArr,
  errorMsg: string,
};

export default class PlotList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handlePlotList = this.handlePlotList.bind(this);

    this.state = {
      plots: [],
      errorMsg: "",
    };
  }

  componentDidMount() {
    this.handlePlotList();
  }

  async handlePlotList() {
    let [responseStatus, responseMsg, responsePlots] = await Plot.list();

    if (responseStatus > 199 && responseStatus < 300) {
      this.setState({
        plots: responsePlots
      });
      // veliau perrasysiu normaliai
    } else {
      this.setState({
        errorMsg: responseMsg,
      });
    }
  }

  render() {
    const { plots, errorMsg } = this.state

    return (
      <div className="col-md-12">
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
          {
            plots.map((plot : IPlot) => (
              <tr key={plot.id}>
                  <td>{plot.userId}</td>
                  <td>{plot.streetName}</td>
                  <td>{plot.lotNo}</td>
                  <td>{plot.areaSize}</td>
                  <td>{plot.purpose}</td>
                  <td>{plot.type}</td>
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