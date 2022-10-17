// For JWT handling

import axios from "axios";
import authHeader from "../global/authHeader";
import { errorHandler } from "../global/errorHandler";
import { IStreet, IStreetArr} from "../types/street";

class Street {
  private timeout : number;
  private host : string;

  constructor() {
    this.host = process.env.REACT_APP_USE_TLS ? "http://" + process.env.REACT_APP_BACKEND_HOST + ":" + process.env.REACT_APP_BACKEND_PORT : "https://127.0.0.1:" + process.env.REACT_APP_BACKEND_PORT;

    // For all methods, wait 10 seconds before timing out
    this.timeout = 10000
  }

  async list() : Promise<[number, string, IStreetArr]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let streets: IStreetArr = [];
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/street/",
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

  async create(name: string, city: string, district: string, addressCount: number, streetLength: string) : Promise<[number, string]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    try {
    await new Promise((resolve, reject) => axios
      .post(this.host + "/api/street", {
        name,
        city,
        district,
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

  async read(streetId: number) : Promise<[number, string, IStreet]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let street: IStreet = {
      id: 0,
      userId: 0,
      name: "",
      city: "",
      district: "",
      addressCount: 0,
      streetLength: ""
    };
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/street/" + streetId,
      { timeout: this.timeout,
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

  
  async update(streetId: number, name: string, city: string, district: string, addressCount: number, streetLength: string) : Promise<[number, string, IStreet]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    let street: IStreet = {
      id: 0,
      userId: 0,
      name: "",
      city: "",
      district: "",
      addressCount: 0,
      streetLength: ""
    };

    try {
    await new Promise((resolve, reject) => axios
      .put(this.host + "/api/street/" + streetId, {
        name,
        city,
        district,
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

  async remove(streetId: number) : Promise<[number, string]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    try {
    await new Promise((resolve, reject) => axios
      .delete(this.host + "/api/street/" + streetId,
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

}

export default new Street();