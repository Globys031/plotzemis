import { Component } from "react";

import Plot from "../../api/plot";

import { Table, Button } from 'react-bootstrap'
import { IPlot, IPlotArr } from "../../types/plot";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

type Props = {
  loggedIn: boolean,
  streetId: number
};

type State = {
  plots: IPlotArr,
  errorMsg: string,

  submittedRemove: boolean,
  isLoadingRemove: boolean,
};

class PlotList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handlePlotList = this.handlePlotList.bind(this);

    this.state = {
      plots: [],
      errorMsg: "",

      submittedRemove: false,
      isLoadingRemove: false,
    };
  }

  componentDidMount() {
    this.handlePlotList();
  }

  async handlePlotList() {
    let [responseStatus, responseMsg, responsePlots] = await Plot.list(this.props.streetId);

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

  async handlePlotRemove(plotId: number) {
    this.setState({
      errorMsg: "",
      submittedRemove: false,
      isLoadingRemove: true,
    });

    let [responseStatus, responseMsg] = await Plot.remove(this.props.streetId, plotId);

    if (responseStatus > 199 && responseStatus < 300) {
      // will rewrite it properly later
    } else {
      this.setState({
        errorMsg: responseMsg,
      });
    }
    this.handlePlotList();
    this.setState({
      submittedRemove: true,
      isLoadingRemove: false,
    });
  }

  render() {
    const { plots, errorMsg, isLoadingRemove, submittedRemove } = this.state

    return (
      <div className="col-md-12">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Id</th>
              <th>Street Id</th>
              <th>User Id</th>
              <th>Lot number</th>
              <th>Area size</th>
              <th>Purpose</th>
              <th>Type</th>
              <th colSpan={5}>Actions</th>
            </tr>
          </thead>
          <tbody>
          {
            plots.map((plot : IPlot) => (
              <tr key={plot.id}>
                  <td>{plot.id}</td>
                  <td>{plot.userId}</td>
                  <td>{plot.streetId}</td>
                  <td>{plot.lotNo}</td>
                  <td>{plot.areaSize}</td>
                  <td>{plot.purpose}</td>
                  <td>{plot.type}</td>
                  <td>
                    <Link to={"/building/list/" + this.props.streetId + "/" + plot.id}>
                      <Button variant="dark">
                        List buildings
                      </Button>
                    </Link>
                  </td>
                  {this.props.loggedIn && (
                    <td>
                      <Link to={"/building/create/" + this.props.streetId + "/" + plot.id}>
                        <Button variant="dark">
                          Add building
                        </Button>
                      </Link>
                    </td>
                  )}
                  <td>
                    <Link to={"/plot/read/" + this.props.streetId + "/" + plot.id}>
                      <Button variant="dark">
                        Read plot
                      </Button>
                    </Link>
                  </td>
                  {this.props.loggedIn && (
                    <td>
                      <Button
                        variant="dark"
                        disabled={isLoadingRemove}
                        // onClick={this.handleStreetRemove(street.id)}
                        onClick={() => this.handlePlotRemove(plot.id)}
                      >
                        {isLoadingRemove ? 'Loading…' : 'Remove plot'}
                      </Button>
                    </td>
                  )}
                  {this.props.loggedIn && (
                    <td>
                      <Link to={"/plot/update/" + this.props.streetId + "/" + plot.id}>
                        <Button variant="dark">
                          Update plot
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
          <Link to={"/plot/create/" + this.props.streetId}>
            <Button variant="primary">
              Add new plot
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

        <Link to={"/street/list/"}>
          <Button variant="dark">
            Go back
          </Button>
        </Link>

      </div>
    );
  }
}

export default function PlotListWrapper(props: { loggedIn: boolean; }) {
  // loggedIn biski kitaip reikia pasiimt. Reikia pasiimt per paduodamus props.

  const { streetId } = useParams();
  return (
      <div>
          <PlotList streetId={parseInt(streetId as string)} loggedIn={props.loggedIn} />
      </div>
  );
}