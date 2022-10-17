import { isRouteErrorResponse } from "react-router-dom";
import { object } from "yup";
import IUser from "../types/user";

// helper functions for local browser storage

class Storage  {
  getCurrentUserInfo() : IUser | null {
    const token = this.getCurrentToken();

    // If userStr isn't empty or null
    if (token) {
      const decodedJwt = this.parseJwt(token);
      const user : IUser = {} as IUser;
      const objectValues = Object.values(decodedJwt)

      user.userId = objectValues[2]
      user.username = objectValues[3] as string
      //  Doesn't matter for now:
      // user.password = objectValues[]
      user.email = objectValues[4] as string
      user.role = objectValues[5] as string

      return user
    }

    return null;
  }

  parseJwt(token : string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

  getCurrentToken() : string | null {
    const token = localStorage.getItem("sessionToken");

    // If token isn't empty or null
    if (token) {
      return token;
    }
    return null;
  }
}

export default new Storage();