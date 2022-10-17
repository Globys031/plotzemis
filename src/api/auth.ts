// For JWT handling

import axios from "axios";
import authHeader from "../global/authHeader";
import { errorHandler } from "../global/errorHandler";

class Authentication {
  private deadline : string;
  private host : string;

  constructor() {
    this.host = process.env.REACT_APP_USE_TLS ? "http://" + process.env.REACT_APP_BACKEND_HOST + ":" + process.env.REACT_APP_BACKEND_PORT : "https://127.0.0.1:" + process.env.REACT_APP_BACKEND_PORT;

    // For all grpc methods, wait 5 seconds before timing out
    const currentDate : Date = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + 5);
    this.deadline = currentDate.getTime().toString()
  }

  async register(username: string, email: string, password: string, role: string) : Promise<[number, string]> {
    // Register user and attempt to login right away
    // Return response in a way that makes it clear if an error comes from
    // login, registration server side or if it's a client side error.
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    try {
    await new Promise((resolve, reject) => axios
      .post(this.host + "/api/register", {
        username,
        email,
        password,
        role
      },
      { timeout: 5000,
        headers: authHeader(),
      }) // Timeout after 5 seconds
      .then(response => {

        [responseStatus, responseError] = [response.status, "success"]
        resolve(response)
      })
      .catch(err => {
        // Handle error
        const { responseMsg: errorMessage, status: errorStatus } = errorHandler(err);
        console.log(err);

        [responseStatus, responseError] = [errorStatus, errorMessage as string]
        reject(err.message)
      })
    )
    } catch (err) {
      // no need to do anything additionally, already handled in the first catch      
    }

    return [responseStatus, responseError]
  }

  async login(username: string, password: string) : Promise<[number, string]> {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    try {
    await new Promise((resolve, reject) => axios
      .post(this.host + "/api/login", {
        username,
        password
      },
      { timeout: 5000,
        headers: authHeader(),
      }) // Timeout after 5 seconds
      .then(response => {
        localStorage.setItem("sessionToken", response.data.token);
        [responseStatus, responseError] = [response.status, "success"]
        resolve(response)
      })
      .catch(err => {
        // Handle error
        const { responseMsg: errorMessage, status: errorStatus } = errorHandler(err);
        console.log(err);

        [responseStatus, responseError] = [errorStatus, errorMessage as string]

        console.log("responseError: ", responseError)
        reject(err.message)
      })
    )
    } catch(err) {
      // no need to do anything additionally, already handled in the first catch
    }
    return [responseStatus, responseError]
  }


  // remove JWT from Local Storage
  async logout() {
    localStorage.removeItem("sessionToken");
    // pretty sure kad reiketu istrint ir is serverio puses sessionToken though
  }
}

export default new Authentication();