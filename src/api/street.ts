// For JWT handling

import axios from "axios";
import authHeader from "../global/authHeader";
import { errorHandler } from "../global/errorHandler";
import { IStreet, IStreetArr} from "../types/street";

class Street {
  private timeout : number;
  private host : string;

  constructor() {
    this.host = process.env.REACT_APP_USE_TLS ? "http://127.0.0.1:" + process.env.REACT_APP_BACKEND_PORT : "https://127.0.0.1:" + process.env.REACT_APP_BACKEND_PORT;

    // For all methods, wait 10 seconds before timing out
    this.timeout = 10000
  }

  async list() : Promise<[number, string, IStreetArr]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let streets: IStreetArr = [];
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/street/all",
      { timeout: this.timeout,
      })
      .then(response => {
        streets = response.data.result;
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
    )} catch(err) {
      // no need to do anything additionally, already handled in the first catch
    }
    return [responseStatus, responseError, streets]
  }

  async create(name: string, city: string, district: string, postalCode: string, addressCount: number, streetLength: string) : Promise<[number, string]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    try {
    await new Promise((resolve, reject) => axios
      .post(this.host + "/api/user/street", {
        name,
        city,
        district,
        postalCode,
        addressCount,
        streetLength,
      },
      { timeout: this.timeout,
        headers: authHeader(),
      })
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
    )} catch(err) {
      // no need to do anything additionally, already handled in the first catch
    }
    return [responseStatus, responseError]
  }

  async read(name: string) : Promise<[number, string, IStreet]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let street: IStreet = {
      id: 0,
      userId: 0,
      name: "",
      city: "",
      district: "",
      postalCode: "",
      addressCount: 0,
      streetLength: ""
    };
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/street",
      { timeout: this.timeout,
        params: {
          name: name
        }
        // params: {
        //   name: name
        // }
      })
      .then(response => {
        street = response.data.result;
        [responseStatus, responseError] = [response.status, "success"]
        resolve(response)
      })
      .catch(err => {
        // Handle error
        const { responseMsg: errorMessage, status: errorStatus } = errorHandler(err);
        [responseStatus, responseError] = [errorStatus, errorMessage as string]
        reject(err.message)
      })
    )} catch(err) {
      // no need to do anything additionally, already handled in the first catch
    }
    return [responseStatus, responseError, street]
  }

  
  async update(oldName: string, newName: string, city: string, district: string, postalCode: string, addressCount: number, streetLength: string) : Promise<[number, string, IStreet]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    let street: IStreet = {
      id: 0,
      userId: 0,
      name: "",
      city: "",
      district: "",
      postalCode: "",
      addressCount: 0,
      streetLength: ""
    };

    try {
    await new Promise((resolve, reject) => axios
      .put(this.host + "/api/user/street", {
        oldName,
        newName,
        city,
        district,
        postalCode,
        addressCount,
        streetLength,
      },
      { timeout: this.timeout,
        headers: authHeader(),
      })
      .then(response => {
        street = response.data.result;
        [responseStatus, responseError] = [response.status, "success"]
        resolve(response)
      })
      .catch(err => {
        // Handle error
        const { responseMsg: errorMessage, status: errorStatus } = errorHandler(err);
        [responseStatus, responseError] = [errorStatus, errorMessage as string]
        reject(err.message)
      })
    )} catch(err) {
      // no need to do anything additionally, already handled in the first catch
    }
    return [responseStatus, responseError, street]
  }

  async remove(name: string, notAdmin: boolean) : Promise<[number, string]>  {
    let path: string = "";
    if (notAdmin === true) {
      path = "/api/user/street/remove";
    } else {
      path = "/api/admin/street/remove";
    }

    let [responseStatus, responseError] = [400, "something went wrong client side"];
    try {
    await new Promise((resolve, reject) => axios
      .delete(this.host + path,
      { timeout: this.timeout,
        headers: authHeader(),
        params: {
          name: name
        }
      })
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
    )} catch(err) {
      // no need to do anything additionally, already handled in the first catch
    }
    return [responseStatus, responseError]
  }

}

export default new Street();