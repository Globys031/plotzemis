import { Component } from "react";

import Plot from "../../api/plot";
import { IPlot } from "../../types/plot";

import { Table, Button} from 'react-bootstrap'
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

type Props = {
  streetId: number,
  plotId: number,
};

type State = {
  plot: IPlot,
  errorMsg: string,
};

class PlotRead extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handlePlotRead = this.handlePlotRead.bind(this);

    this.state = {
      plot: {} as IPlot,
      errorMsg: "",
    };
  }

  componentDidMount() {
    this.handlePlotRead();
  }

  async handlePlotRead() {
    let [responseStatus, responseMsg, responsePlot] = await Plot.read(this.props.streetId, this.props.plotId);

    if (responseStatus > 199 && responseStatus < 300) {
      this.setState({
        plot: responsePlot,
      });
      // will rewrite it properly later
    } else {
      this.setState({
        plot: responsePlot,
        errorMsg: responseMsg,
      });
    }
  }

  render() {
    const { errorMsg, plot } = this.state

    return (
      <div className="col-md-12">
        {plot.type && (
        <Table striped bordered hover>
          <thead>
            <tr>
            <th>User Id</th>
              <th>Street Id</th>
              <th>Lot number</th>
              <th>Area size</th>
              <th>Purpose</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
              <tr key={plot.id}>
              <td>{plot.userId}</td>
              <td>{plot.streetId}</td>
              <td>{plot.lotNo}</td>
              <td>{plot.areaSize}</td>
              <td>{plot.purpose}</td>
              <td>{plot.type}</td>
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

        <Link to={"/plot/list/" + this.props.streetId}>
          <Button variant="dark">
            Go back
          </Button>
        </Link>
      </div>
    );
  }
}

export default function PlotReadWrapper() {
  const { streetId, plotId } = useParams();
  return (
      <div>
          <PlotRead streetId={parseInt(streetId as string)} plotId={parseInt(plotId as string)}/>
      </div>
  );
}