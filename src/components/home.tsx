import React from "react";
import { Component } from "react";

type Props = {};

type State = {
  content: string;
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    // Nereikia sito dabar. Cia is serverio puses pasiimtu content
    // Pavyzdy padaryta taip, kad nuejus i /home, iskviestu content prieinama visiem user'iams

    // UserService.getPublicContent().then(
    //   response => {
    //     this.setState({
    //       content: response.data
    //     });
    //   },
    //   error => {
    //     this.setState({
    //       content:
    //         (error.response && error.response.data) ||
    //         error.message ||
    //         error.toString()
    //     });
    //   }
    // );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
      </div>
    );
  }
}