import { Component } from "react";
import MapImage from "../images/map.png";

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

type Props = {};

type State = {
  show: boolean,
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      show: false,
    };
  }

  handleClose = () => this.setState({show: false})
  handleShow = () => this.setState({show: true})

  render() {
    const { show } = this.state;

    return (
      <div>

      <h1>Home page</h1>

      <Alert variant="info" className="d-none d-lg-block">
        If you resize the browser, the image will become invisible
      </Alert>

      <Offcanvas show={show} onHide={this.handleClose} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Responsive offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="col-md-12">
            <div className="card">
              <img src={MapImage} alt="Doggie" />
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>



      </div>
    );
  }
}