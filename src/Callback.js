import React, { Component } from "react";
class Callback extends Component {
  componentDidMount() {
    // Handle authentication if expected values are in url callback via regex test
    // token in this.props.location.hash property!
    if (/access_token|id_token|error/.test(this.props.location.hash)) {
      this.props.auth.handleAuthentication();
    } else {
      throw new Error("invalid callback url!");
    }
  }
  render() {
    console.log(this.props.location);
    return <h1>Loading...</h1>;
  }
}

export default Callback;
