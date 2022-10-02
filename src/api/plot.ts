// For JWT handling

import axios from "axios";
import authHeader from "../global/authHeader";
import { errorHandler } from "../global/errorHandler";
import { IPlot, IPlotArr} from "../types/plot";

class Plot {
  private timeout : number;
  private host : string;

  constructor() {
    this.host = process.env.REACT_APP_USE_TLS ? "http://" + process.env.REACT_APP_BACKEND_HOST + ":" + process.env.REACT_APP_BACKEND_PORT : "https://127.0.0.1:" + process.env.REACT_APP_BACKEND_PORT;

    // For all methods, wait 10 seconds before timing out
    this.timeout = 10000
  }

  async list() : Promise<[number, string, IPlotArr]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let plots: IPlotArr = [];
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/plot/all",
      { timeout: this.timeout,
      })
      .then(response => {
        plots = response.data.result;
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
    return [responseStatus, responseError, plots]
  }

  async create(streetName: string, lotNo: number, areaSize: number, purpose: string, type: string) : Promise<[number, string]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    try {
    await new Promise((resolve, reject) => axios
      .post(this.host + "/api/user/plot", {
        streetName: streetName,
        lotNo: lotNo,
        areaSize: areaSize,
        purpose: purpose,
        type: type,
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

  async read(streetName: string, lotNo: number) : Promise<[number, string, IPlot]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let plot: IPlot = {
      id: 0,
      userId: 0,
      streetName: "",
      lotNo: 0,
      areaSize: 0,
      purpose: "",
      type: "",
    };
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/plot",
      { timeout: this.timeout,
        params: {
          streetName: streetName,
          lotNo: lotNo,
        }
      })
      .then(response => {
        plot = response.data.result;
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
    return [responseStatus, responseError, plot]
  }

  
  async update(streetName: string, lotNo: number, areaSize: number, purpose: string, type: string) : Promise<[number, string, IPlot]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    let plot: IPlot = {
      id: 0,
      userId: 0,
      streetName: "",
      lotNo: 0,
      areaSize: 0,
      purpose: "",
      type: "",
    };

    try {
    await new Promise((resolve, reject) => axios
      .put(this.host + "/api/user/plot", {
        streetName,
        lotNo,
        areaSize,
        purpose,
        type,
      },
      { timeout: this.timeout,
        headers: authHeader(),
      })
      .then(response => {
        plot = response.data.result;
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
    return [responseStatus, responseError, plot]
  }

  async remove(streetName: string, lotNo: number, notAdmin: boolean) : Promise<[number, string]>  {
    let path: string = "";
    if (notAdmin === true) {
      path = "/api/user/plot/remove";
    } else {
      path = "/api/admin/plot/remove";
    }

    let [responseStatus, responseError] = [400, "something went wrong client side"];
    try {
    await new Promise((resolve, reject) => axios
      .delete(this.host + path,
      { timeout: this.timeout,
        headers: authHeader(),
        params: {
          streetName: streetName,
          lotNo: lotNo
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

export default new Plot();