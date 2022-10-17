import { Component } from "react";

import Building from "../../api/building";
import { IBuilding } from "../../types/building";

import { Table, Button} from 'react-bootstrap'
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


type Props = {
  streetId: number,
  plotId: number,
  buildingId: number,
};

type State = {
  building: IBuilding,
  errorMsg: string,
};

class BuildingRead extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleBuildingRead = this.handleBuildingRead.bind(this);

    this.state = {
      building: {} as IBuilding,
      errorMsg: "",
    };
  }

  componentDidMount() {
    this.handleBuildingRead();
  }

  async handleBuildingRead() {
    let [responseStatus, responseMsg, responseBuilding] = await Building.read(this.props.streetId, this.props.plotId, this.props.buildingId);

    if (responseStatus > 199 && responseStatus < 300) {
      this.setState({
        building: responseBuilding,
      });
      // will rewrite it properly later
    } else {
      this.setState({
        building: responseBuilding,
        errorMsg: responseMsg,
      });
    }
  }

  render() {
    const { errorMsg, building } = this.state
    
    console.log(building)

    return (
      <div className="col-md-12">
        {building.streetNumber && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User Id</th>
              <th>Street Id</th>
              <th>Plot Id</th>
              <th>Street number</th>
              <th>Type</th>
              <th>Area size</th>
              <th>Floor count</th>
              <th>Year</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
              <tr key={building.id}>
              <td>{building.userId}</td>
              <td>{building.streetId}</td>
              <td>{building.plotId}</td>
              <td>{building.streetNumber}</td>
              <td>{building.type}</td>
              <td>{building.areaSize}</td>
              <td>{building.floorCount}</td>
              <td>{building.year}</td>
              <td>{building.price}</td>
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

        <Link to={"/building/list/" + this.props.streetId + "/" + this.props.plotId}>
          <Button variant="dark">
            Go back
          </Button>
        </Link>
      </div>
    );
  }
}

export default function BuildingReadWrapper() {
  const { streetId, plotId, buildingId } = useParams();
  return (
      <div>
          <BuildingRead streetId={parseInt(streetId as string)} plotId={parseInt(plotId as string)} buildingId={parseInt(buildingId as string)}/>
      </div>
  );
}