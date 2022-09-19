import User from "../protoLibrary/auth_pb";

// helper functions for local browser storage

class Storage  {
  getCurrentUserInfo() : User.User | null {
    const userStr = localStorage.getItem("user");

    // If userStr isn't empty or null
    if (userStr) {
      const user : User.User = new User.User();
  
      const stringArr = userStr.split(",")
      user.setUserid(Number(stringArr[0]))
      user.setUsername(stringArr[1])
      user.setEmail(stringArr[2])
      user.setPassword(stringArr[3])
      user.setRole(stringArr[4])

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