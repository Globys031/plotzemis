// For JWT handling

import {AuthServiceClient} from "../protoLibrary/AuthServiceClientPb";
import * as library from "../protoLibrary/auth_pb";

import authHeaders from "./authHeader";

class Authentication {
  private deadline : string;
  private host : string;

  constructor() {
    this.host = process.env.REACT_APP_USE_TLS ? "http://127.0.0.1:" + process.env.REACT_APP_AUTH_BACKEND_PORT : "https://127.0.0.1:" + process.env.REACT_APP_AUTH_BACKEND_SSL_PORT;

    // For all grpc methods, wait 5 seconds before timing out
    const currentDate : Date = new Date();
    currentDate.setSeconds(currentDate.getSeconds() + 5);
    this.deadline = currentDate.getTime().toString()
  }

  // POST {username, email, password}
  async register(username: string, email: string, password: string, role: string) : Promise<[number, string]> {
    const client = new AuthServiceClient(this.host)
    const registerRequest = new library.RegisterRequest();
    registerRequest.setUsername(username);
    registerRequest.setEmail(email);
    registerRequest.setPassword(password);
    registerRequest.setRole(role);

    console.log("role:", role)

    // https://github.com/grpc/grpc-web/pull/1063/files
    // The "deadline" header is used to timeout xhr http request
    // and it converts deadline header to "grpc-timeout" header.
    // Making it so that the server also check for when it should timeou
    // example:
    // https://github.com/grpc/grpc-web/blob/master/javascript/net/grpc/web/grpcwebclientbase_test.js#L78
    let metadata = authHeaders()
    metadata["deadline"] = this.deadline

    // Register user and attempt to login right away
    // Return response in a way that makes it clear if an error comes from
    // login, registration server side or if it's a client side error.
    let [responseStatus, responseError] = [400, "something went wrong"]
    try {
      await new Promise((resolve, reject) => client.register(
        registerRequest, 
        metadata,
        async (err, response) => {
          if (err) {
            console.log(new Error(err.code + "\n" + err.message));

            [responseStatus, responseError] = [err.code, err.message]
            return reject(err.message)
          } else {
            [responseStatus, responseError] = [response.getStatus(), response.getError()]
            resolve(response as library.RegisterResponse)
          }
          console.log("register.onEnd.message", response);
        }
        ));
    } catch (error) {
      // Error already handled in "if (err)"
      // Catch statement is necessary to avoid infinite loop after rejection
    }
    return [responseStatus, responseError]
  }

  // POST {username, password} & save JWT to Local Storage
  async login(username: string, password: string) : Promise<[number, string]> {
    const client = new AuthServiceClient(this.host)
    const loginRequest = new library.LoginRequest();
    loginRequest.setUsername(username);
    loginRequest.setPassword(password);

    let metadata = authHeaders()
    metadata["deadline"] = this.deadline

    let [responseStatus, responseError] = [400, "something went wrong"]
    try {
      // response = await new Promise((resolve, reject) => client.login(
      await new Promise((resolve, reject) => client.login(
        loginRequest, 
        metadata,
        (err, response) => {
          if (err) { // Will return an error if message is null
            console.log(new Error(err.code + "\n" + err.message));

            [responseStatus, responseError] = [err.code, err.message]
            return reject(err.message)
          } else {
            if (response?.getStatus() > 199 && response?.getStatus() < 300) {
              // Assume user details are filled out if server responded positively
              localStorage.setItem("user", response.getUserdetails()?.toString()!);
              localStorage.setItem("sessionToken", response.getToken());
            }
            [responseStatus, responseError] = [response.getStatus(), response.getError()]
            resolve(response as library.LoginResponse)
          }
          console.log("login.onEnd.message", response);
        }
        ));
    } catch (error) {
      // Error already handled in "if (err)"
      // Catch statement is necessary to avoid infinite loop after rejection
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