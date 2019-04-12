import auth0 from "auth0-js";

export default class Auth {
  // we will pass in react routers history obj so auth can perform redirects
  constructor(history) {
    this.history = history;

    // user's profile
    this.userProfile = null;

    // new auth0 instance
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      // we want 2 things:
      // a) a token (used to make api calls to the resource server?)
      // b) id_token (jwt token we can use to authenticate user when they log in)
      responseType: "token id_token",

      // permissions i.e. scopes we want: openID includes name, photo, etc.
      // when user signs up with 3 party services, they have to give consent to these scopes
      scope: "openid profile email"
    });
  }

  login = () => {
    this.auth0.authorize();
  };
  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.history.push("/");
        console.log("hahaha");
      } else if (err) {
        this.history.push("/");
        alert(`Error: ${err.error}. Check the console for further details`);
        console.log(err);
      }
    });
  };
  /*
    Steps to calculate unix epoch time (used by authResult.expiresIn property)
    1. authResult.expiresIn contains expiration in seconds
    2. Multiple by 1000 to convert to milliseconds
    3. add current unix epoch time i.e. + new Date().getTime() {counted from 1970s research}
    this gives us unix epoch time when token will expire i.e. how we read time

  */

  setSession = authResult => {
    // set the time variable to when access token expire in "Unix epoch time"
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  };

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
  logout = () => {
    // removing local data logging out
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");

    this.userProfile = null;

    // removing auth0 cookie and logging auth0 out
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      returnTo: "http://localhost:3000"
    });
  };

  getAccessToken = () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      throw new Error("access token not found!");
    }
    return accessToken;
  };
  getProfile = cb => {
    if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
      if (profile) this.userProfile = profile;
      cb(profile, err);
    });
  };
}
