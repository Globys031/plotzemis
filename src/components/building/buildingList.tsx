import { Component } from "react";

import Building from "../../api/building";

import { Table, Button } from 'react-bootstrap'
import { IBuilding, IBuildingArr } from "../../types/building";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";


type Props = {
  loggedIn: boolean,
  streetId: number,
  plotId: number
};

type State = {
  buildings: IBuildingArr,
  errorMsg: string,

  submittedRemove: boolean,
  isLoadingRemove: boolean,
};

class BuildingList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleBuildingList = this.handleBuildingList.bind(this);

    this.state = {
      buildings: [],
      errorMsg: "",

      submittedRemove: false,
      isLoadingRemove: false,
    };
  }

  componentDidMount() {
    this.handleBuildingList();
  }

  async handleBuildingList() {
    let [responseStatus, responseMsg, responseBuildings] = await Building.list(this.props.streetId, this.props.plotId);

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

  async handleBuildingRemove(buildingId: number) {
    this.setState({
      errorMsg: "",
      submittedRemove: false,
      isLoadingRemove: true,
    });

    let [responseStatus, responseMsg] = await Building.remove(this.props.streetId, this.props.plotId, buildingId);

    if (responseStatus > 199 && responseStatus < 300) {
      // will rewrite it properly later
    } else {
      this.setState({
        errorMsg: responseMsg,
      });
    }
    this.handleBuildingList();
    this.setState({
      submittedRemove: true,
      isLoadingRemove: false,
    });
  }

  render() {
    const { buildings, errorMsg, isLoadingRemove, submittedRemove } = this.state

    return (
      <div className="col-md-12">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Id</th>
              <th>Street Id</th>
              <th>Plot Id</th>
              <th>User Id</th>
              <th>Street number</th>
              <th>Postal code</th>
              <th>Type</th>
              <th>Area size</th>
              <th>Floor count</th>
              <th>Year</th>
              <th>Price</th>
              <th colSpan={3}>Actions</th>
            </tr>
          </thead>
          <tbody>
          {
            buildings.map((building : IBuilding) => (
              <tr key={building.id}>
                  <td>{building.id}</td>
                  <td>{building.streetId}</td>
                  <td>{building.plotId}</td>
                  <td>{building.userId}</td>
                  <td>{building.streetNumber}</td>
                  <td>{building.postalCode}</td>
                  <td>{building.type}</td>
                  <td>{building.areaSize}</td>
                  <td>{building.floorCount}</td>
                  <td>{building.year}</td>
                  <td>{building.price}</td>
                  <td>
                    <Link to={"/building/read/" + this.props.streetId + "/" + this.props.plotId  + "/" + building.id}>
                      <Button variant="dark">
                        Read building
                      </Button>
                    </Link>
                  </td>
                  {this.props.loggedIn && (
                    <td>
                      <Button
                        variant="dark"
                        disabled={isLoadingRemove}
                        // onClick={this.handleStreetRemove(street.id)}
                        onClick={() => this.handleBuildingRemove(building.id)}
                      >
                        {isLoadingRemove ? 'Loading…' : 'Remove building'}
                      </Button>
                    </td>
                  )}
                  {this.props.loggedIn && (
                    <td>
                      <Link to={"/building/update/" + this.props.streetId + "/" + this.props.plotId + "/" + building.id}>
                        <Button variant="dark">
                          Update building
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
          <Link to={"/building/create/" + this.props.streetId + "/" + this.props.plotId}>
            <Button variant="primary">
              Add new building
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

        <Link to={"/plot/list/" + this.props.streetId}>
          <Button variant="dark">
            Go back
          </Button>
        </Link>

      </div>
    );
  }
}

export default function BuildingListWrapper(props: { loggedIn: boolean; }) {
  const { streetId, plotId } = useParams();
  return (
      <div>
          <BuildingList streetId={parseInt(streetId as string)} plotId={parseInt(plotId as string)} loggedIn={props.loggedIn} />
      </div>
  );
}