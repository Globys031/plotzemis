import { Component } from "react";
import { Navigate } from "react-router-dom";
import MediaQuery from 'react-responsive'

import {userContext} from '../user/userContext';
import Storage from "../user/userStorage";

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

    // mobile-font

    return (
      <div className="container">
        <MediaQuery minWidth={1000}>

          {this.context.user && (
          <div>
            <header className="jumbotron">
              <h3>
                <strong>{this.context.user?.username}</strong> Profile
              </h3>
            </header>
            <p>
              <strong>Id:</strong>{" "}
              {this.context.user?.userId}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {this.context.user?.email}
            </p>
            <p>
              <strong>Role:</strong>{" "}
              {this.context.user?.role}
            </p>
          </div>
          )}
        </MediaQuery>


        <MediaQuery maxWidth={1000}>
          <div className="mobile-font">
            <div className="container">

            {this.context.user && (
            <div>
              <header className="jumbotron mobile-header-font">
                <h3>
                  <strong>{this.context.user?.username}</strong> Profile
                </h3>
              </header>
              <p>
                <strong>Id:</strong>{" "}
                {this.context.user?.userId}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {this.context.user?.email}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                {this.context.user?.role}
              </p>
            </div>
            )}
            </div>
          </div>
        </MediaQuery>

      </div>
    );
  }
}