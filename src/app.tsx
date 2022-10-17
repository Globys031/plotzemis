// https://create-react-app.dev/docs/adding-custom-environment-variables/
// here is also a built-in environment variable called NODE_ENV that's used
// to find whether the app is in production or development mode

import {Component} from "react";
import { Routes, Route, Link } from "react-router-dom";

// https://react-bootstrap.github.io/getting-started/introduction#stylesheets
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown } from 'react-bootstrap';
import "./app.css";

import Authentication from "./api/auth";

import IUser from "./types/user";

import Login from "./components/login";
import Register from "./components/register";
import Profile from "./components/profile";
import PageNotFound from "./components/404";
import Home from "./components/home";
import Sidebar from './components/sidebar';

import StreetCreate from './components/street/streetCreate';
import StreetList from './components/street/streetList';
import StreetReadWrapper from './components/street/streetRead';
import StreetUpdateWrapper from './components/street/streetUpdate';

import PlotCreateWrapper from './components/plot/plotCreate';
import PlotListWrapper from './components/plot/plotList';
import PlotReadWrapper from './components/plot/plotRead';
import PlotUpdateWrapper from './components/plot/plotUpdate';

import BuildingCreateWrapper from './components/building/buildingCreate';
import BuildingListWrapper from './components/building/buildingList';
import BuildingReadWrapper from './components/building/buildingRead';
import BuildingUpdateWrapper from './components/building/buildingUpdate';

import EventBus from "./global/eventBus";
import Storage from "./user/userStorage";
import {userContext, IUserContext} from './user/userContext';
import Footer from './components/footer';

type Props = {};

type State = {
  user: IUser | null,
  hasError: boolean,
}

class App extends Component<Props, State> {
  static contextType = userContext;
  declare context: React.ContextType<typeof userContext>

  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    const currentUser = Storage.getCurrentUserInfo();
    
    this.state = {
      user: currentUser,
      hasError: false,
    };
  }


  // https://reactjs.org/docs/react-component.html#componentdidmount
  // componentDidMount() is invoked immediately after
  // a component is mounted (inserted into the tree).
  componentDidMount() {
    // Setup an event listener for the "logout" event.
    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout", this.logOut);

    // patikrinau kad sitas panaikins localstorage jeigu
    // isjungsi sena tab'a.
    localStorage.clear();
  }

  // For error handling https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  async logOut() {
    await Authentication.logout();
    this.setState({
      user: null,
    });
  }

  render() {
    const value : IUserContext = {
      user: this.state.user,
      setUserState: () => {
        // Will trigger a rerendering of all child components of userContext.Provider
        this.setState({user: Storage.getCurrentUserInfo()});
      }
    }

    if (this.state.hasError) {
      return <div>Couldn't load app UI</div>;
    }

    return (
      <div>
        <div>
        </div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <userContext.Provider value={value}>
            <Sidebar />
          </userContext.Provider>
          <Link to={"/home"} className="navbar-brand">
          Home
          </Link>
          {this.state.user ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Welcome, {this.state.user.username}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                    <Dropdown.Item href="/settings">Settings (not yet implemented)</Dropdown.Item>
                    <Dropdown.Item href="/login" onClick={this.logOut}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>

              {this.state.user.role === "ADMIN" && (
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Register user
                </Link>
              </li>
              )}
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>
        <div className="page-container">
          <div className="content-wrap">

            <div className="container mt-3">
              {this.state.user ? (
                <Routes>
                  {/* https://reactrouter.com/docs/en/v6/upgrading/v5
                  If you want to match more of the URL because you have child routes use 
                  a trailing * as in <Route path="users/*">. */}

                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  {/* if logged in, only show registration page for admin user */}
                  {this.state.user.role === "ADMIN" && (
                    <Route path="/register" element={<Register />} />
                  )}

                  {/* Profile needs to be wrapped in context 
                  element for context to be passed over to the profile element. */}
                  {/* /profile and /login both loading "Profile" element is a workaround
                  implemented due to limitations of "Navigate" component */}
                  {['profile', 'login'].map(path => <Route key={path} path={path} element={
                    <userContext.Provider value={value}>
                      <Profile />
                    </userContext.Provider>
                  } />)}

                  {/* <Route path="/profile" element={
                    <userContext.Provider value={value}>
                      <Profile />
                    </userContext.Provider>
                  }></Route> */}

                  <Route path="/register" element={<Register />} />

                  {/* <Route path="/street/list" element={<StreetList />} /> */}
                  <Route path="/street/list" element={<StreetList loggedIn={true} />} />
                  <Route path="/street/create" element={<StreetCreate />} />
                  <Route path="/street/read/:streetId" element={<StreetReadWrapper />} />
                  <Route path="/street/update/:streetId" element={<StreetUpdateWrapper />} />

                  <Route path="/plot/list/:streetId" element={<PlotListWrapper loggedIn={true} />} />
                  <Route path="/plot/create/:streetId" element={<PlotCreateWrapper />} />
                  <Route path="/plot/read/:streetId/:plotId" element={<PlotReadWrapper />} />
                  <Route path="/plot/update/:streetId/:plotId" element={<PlotUpdateWrapper />} />

                  <Route path="/building/list/:streetId/:plotId" element={<BuildingListWrapper loggedIn={true} />} />
                  <Route path="/building/create/:streetId/:plotId" element={<BuildingCreateWrapper />} />
                  <Route path="/building/read/:streetId/:plotId/:buildingId" element={<BuildingReadWrapper />} />
                  <Route path="/building/update/:streetId/:plotId/:buildingId" element={<BuildingUpdateWrapper />} />

                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              ) : (
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={
                    <userContext.Provider value={value}>
                      <Login />
                    </userContext.Provider>
                  }></Route>
                  <Route path="/register" element={<Register />} />

                  <Route path="/street/list" element={<StreetList loggedIn={false} />} />
                  <Route path="/street/create" element={<StreetCreate />} />
                  <Route path="/street/read/:streetId" element={<StreetReadWrapper />} />

                  <Route path="/plot/list/:streetId" element={<PlotListWrapper loggedIn={false} />} />
                  <Route path="/plot/create/:streetId" element={<PlotCreateWrapper />} />
                  <Route path="/plot/read/:streetId/:plotId" element={<PlotReadWrapper />} />

                  <Route path="/building/list/:streetId/:plotId" element={<BuildingListWrapper loggedIn={false} />} />
                  <Route path="/building/create/:streetId/:plotId" element={<BuildingCreateWrapper />} />
                  <Route path="/building/read/:streetId/:plotId/:buildingId" element={<BuildingReadWrapper />} />

                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              )}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;