import IUser from "../types/user";

// helper functions for local browser storage

class Storage  {
  getCurrentUserInfo() : IUser | null {
    const userStr = localStorage.getItem("user");

    // If userStr isn't empty or null
    if (userStr) {
      const user : IUser = {} as IUser;
  
      const stringArr = userStr.split(",")
      user.userId = Number(stringArr[0])
      user.username = stringArr[1]
      user.email = stringArr[2]
      user.password = stringArr[3]
      user.role = stringArr[4]

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