import {Component} from "react";

type Props = {};
type State = {}

export default class PageNotFound extends Component<Props, State> {
  // constructor(props: Props) {
  //   super(props);
  //   this.setState({});
  // }
  render() {
    return (
      <div>
        <h1>404 Error</h1>
        <h1>Page Not Found</h1>
      </div>
    );
  }
}