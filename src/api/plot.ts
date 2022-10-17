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

  async list(streetId: number) : Promise<[number, string, IPlotArr]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let plots: IPlotArr = [];
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/street/" + streetId + "/",
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

  async create(streetId: number, lotNo: number, areaSize: number, purpose: string, type: string) : Promise<[number, string]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    try {
    await new Promise((resolve, reject) => axios
      .post(this.host + "/api/street/" + streetId, {
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

  async read(streetId: number, plotId: number) : Promise<[number, string, IPlot]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let plot: IPlot = {
      id: 0,
      userId: 0,
      streetId: 0,
      lotNo: 0,
      areaSize: 0,
      purpose: "",
      type: "",
    };
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/street/" + streetId + "/" + plotId,
      { timeout: this.timeout,
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

  
  async update(streetId: number, plotId: number, lotNo: number, areaSize: number, purpose: string, type: string) : Promise<[number, string, IPlot]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    let plot: IPlot = {
      id: 0,
      userId: 0,
      streetId: 0,
      lotNo: 0,
      areaSize: 0,
      purpose: "",
      type: "",
    };

    try {
    await new Promise((resolve, reject) => axios
      .put(this.host + "/api/street/" + streetId + "/" + plotId, {
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

  async remove(streetId: number, plotId: number) : Promise<[number, string]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    try {
    await new Promise((resolve, reject) => axios
      .delete(this.host + "/api/street/" + streetId + "/" + plotId,
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

export default new Plot();