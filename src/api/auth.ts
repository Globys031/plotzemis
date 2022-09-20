// For JWT handling

import axios from "axios";
import authHeader from "../global/authHeader";
import { errorHandler } from "../global/errorHandler";

class Authentication {
  private deadline : string;
  private host : string;

  constructor() {
    this.host = process.env.REACT_APP_USE_TLS ? "http://127.0.0.1:" + process.env.REACT_APP_BACKEND_PORT : "https://127.0.0.1:" + process.env.REACT_APP_BACKEND_PORT;

    // For all grpc methods, wait 5 seconds before timing out
    const currentDate : Date = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + 5);
    this.deadline = currentDate.getTime().toString()
  }

  // // POST {username, email, password}
  // async register(username: string, email: string, password: string, role: string) : Promise<[number, string]> {
  //   const client = new auth.AuthServiceClient(this.host)
  //   const registerRequest = new library.RegisterRequest();
  //   registerRequest.setUsername(username);
  //   registerRequest.setEmail(email);
  //   registerRequest.setPassword(password);
  //   registerRequest.setRole(role);

  //   console.log("role:", role)

  //   // https://github.com/grpc/grpc-web/pull/1063/files
  //   // The "deadline" header is used to timeout xhr http request
  //   // and it converts deadline header to "grpc-timeout" header.
  //   // Making it so that the server also check for when it should timeou
  //   // example:
  //   // https://github.com/grpc/grpc-web/blob/master/javascript/net/grpc/web/grpcwebclientbase_test.js#L78
  //   let metadata = authHeader()
  //   metadata["deadline"] = this.deadline

  //   // Register user and attempt to login right away
  //   // Return response in a way that makes it clear if an error comes from
  //   // login, registration server side or if it's a client side error.
  //   let [responseStatus, responseError] = [400, "something went wrong"]
  //   try {
  //     await new Promise((resolve, reject) => client.register(
  //       registerRequest, 
  //       metadata,
  //       async (err, response) => {
  //         if (err) {
  //           console.log(new Error(err.code + "\n" + err.message));

  //           [responseStatus, responseError] = [err.code, err.message]
  //           return reject(err.message)
  //         } else {
  //           [responseStatus, responseError] = [response.getStatus(), response.getError()]
  //           resolve(response as library.RegisterResponse)
  //         }
  //         console.log("register.onEnd.message", response);
  //       }
  //       ));
  //   } catch (error) {
  //     // Error already handled in "if (err)"
  //     // Catch statement is necessary to avoid infinite loop after rejection
  //   }
  //   return [responseStatus, responseError]
  // }

  // async register(username: string, email: string, password: string, role: string) : Promise<[number, string]> {
  //   // Register user and attempt to login right away
  //   // Return response in a way that makes it clear if an error comes from
  //   // login, registration server side or if it's a client side error.
  //   let [responseStatus, responseError] = [400, "something went wrong client side"]
 
  //   return axios
  //   .post(this.host + "/register", {
  //     username,
  //     email,
  //     password,
  //     role
  //   },
  //   { timeout: 5000,
  //     headers: authHeader(),
  //   }) // Timeout after 5 seconds
  //   .then( response => {
  //     [responseStatus, responseError] = [response.status, "success"]
  //     resolve(response as library.RegisterResponse)
  //   })
  //   .catch( err => {
  //     console.log(new Error(err.code + "\n" + err.message));

  //     [responseStatus, responseError] = [err.code, err.message]
  //     return reject(err.message)
  //   });
  //   return [responseStatus, responseError]
  // }


  async register(username: string, email: string, password: string, role: string) : Promise<[number, string]> {
    // Register user and attempt to login right away
    // Return response in a way that makes it clear if an error comes from
    // login, registration server side or if it's a client side error.
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    try {
    await new Promise((resolve, reject) => axios
      .post(this.host + "/auth/register", {
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
      .post(this.host + "/auth/login", {
        username,
        password
      },
      { timeout: 5000,
        headers: authHeader(),
      }) // Timeout after 5 seconds
      .then(response => {
        localStorage.setItem("user", JSON.stringify(response.data));
        localStorage.setItem("sessionToken", response.data.accessToken);
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
    localStorage.removeItem("user");
    localStorage.removeItem("sessionToken");
    // pretty sure kad reiketu istrint ir is serverio puses sessionToken though
  }
}

export default new Authentication();