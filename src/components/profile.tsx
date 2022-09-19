import { Component } from "react";
import { Navigate } from "react-router-dom";

import {userContext} from '../user/userContext';
import Storage from "../global/userStorage";

// import User from "../protoLibrary/auth_pb";

type Props = {};

type State = {
  redirect: string | null,
  userReady: boolean,
}
export default class Profile extends Component<Props, State> {
  static contextType = userContext;
  declare context: React.ContextType<typeof userContext>

  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
    };
  }

  // Redirect to /home in case not logged in.
  componentDidMount() {

    // Assign a contextType to read the current theme context.
    // React will find the closest theme Provider above and use its value.
    // In this example, the current theme is "dark".
    const user = this.context

    // If user is not logged in, redirect him to /home
    if (!user) {
      this.setState({ redirect: "/home" });
      return
    }
    this.setState({ userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    return (
      <div className="container">

      {this.context.user && (
      <div>
        <header className="jumbotron">
          <h3>
            <strong>{this.context.user?.getUsername()}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Id:</strong>{" "}
          {this.context.user?.getUserid()}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {this.context.user?.getEmail()}
        </p>
        <p>
          <strong>Role:</strong>{" "}
          {this.context.user?.getRole()}
        </p>
      </div>
      )}
      </div>
    );
  }
}