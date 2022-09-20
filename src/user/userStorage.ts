import { json } from "stream/consumers";
import IUser from "../types/user";

// helper functions for local browser storage

class Storage  {
  getCurrentUserInfo() : IUser | null {
    const userStr = localStorage.getItem("user");

    // If userStr isn't empty or null
    if (userStr) {
      const user : IUser = JSON.parse(userStr)
      const objectValues = Object.values(user)

      // No clue why it doesn't work if I don't do this.
      // user object looks the same either way as returned by console.log
      user.userId = objectValues[0]
      user.username = objectValues[1]
      user.password = objectValues[2]
      user.email = objectValues[3]
      user.role = objectValues[4]

      return user
    }

    return null;
  }

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