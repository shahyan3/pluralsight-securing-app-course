import React, { Component } from "react";
import { Link } from "react-router-dom";

class Home extends Component {
  state = {};
  render() {
    const { login, isAuthenticated } = this.props.auth;
    return (
      <div>
        <h1>Home</h1>
        {isAuthenticated() ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <button onClick={login}> Login </button>
        )}
      </div>
    );
  }
}

export default Home;
