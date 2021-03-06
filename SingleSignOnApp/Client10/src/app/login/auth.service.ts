import {Injectable} from "@angular/core";
import {tokenNotExpired} from "angular2-jwt";
import {myConfig} from "./auth.config";
let auth0: any = require('auth0-js');

// Avoid name not found warnings
declare var Auth0Lock: any;
declare var Auth0: any;

@Injectable()
export class Auth {
  // Configure Auth0
  private lock = new Auth0Lock(myConfig.clientID, myConfig.domain);
  private auth0 = new Auth0({
    domain: myConfig.domain,
    clientID: myConfig.clientID,
    callbackOnLocationHash: true
  });

  private auth0js = new auth0.WebAuth({
    domain: myConfig.domain,
    clientID: myConfig.clientID,
    redirectUri: "http://localhost:4201",
    responseType: 'code'
  });

  constructor() {
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', (authResult) => {
      this.setProfile(authResult);
    });


    let that = this;
    let isAuthCallback = false;
    this.auth0.getSSOData(function (err, data) {
      if (!isAuthCallback && !err && data.sso) {
        const idToken = localStorage.getItem('id_token');
        if (idToken) {
          console.log('User is already logged in...');
          return;
        }
        console.log('Client 1 - There is a SSO session active');
        // there is! redirect to Auth0 for SSO
        that.auth0.login({
          connection: data.lastUsedConnection.name,
          scope: 'openid name picture',
          popup: true
        }, (err, authResult) => {
          that.setProfile(authResult);
        });
      } else {
        // regular login
        // that.auth0.logout();
        localStorage.removeItem('id_token');
        // localStorage.removeItem('profile');
        console.log('Client 1 - SSO Session is not active');
      }
    });
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show();
  };

  public getUserProfile() {
    if (this.authenticated()) {
      let userProfile = JSON.parse(localStorage.getItem('profile'));
      return userProfile;
    }
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };

  public logout() {
    // Remove token from localStorage
    this.auth0.logout();
    localStorage.removeItem('id_token');
    let logoutUrl = `https://${myConfig.domain}/v2/logout?returnTo=http%3A%2F%2Flocalhost%3A4201&client_id=${myConfig.clientID}`;
    window.location.href = logoutUrl;
  };

  public updateProfile() {
    alert('updating profile')
  }

  public setProfile(authResult) {
    this.lock.getProfile(authResult.idToken, function (error, profile) {
      if (error) {
        console.log(error);
        return;
      }
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('profile', JSON.stringify(profile));
    });
  };
}
