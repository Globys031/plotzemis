// For JWT handling

import axios from "axios";
import authHeader from "../global/authHeader";
import { errorHandler } from "../global/errorHandler";
import { IBuilding, IBuildingArr} from "../types/building";

class Building {
  private timeout : number;
  private host : string;

  constructor() {
    this.host = process.env.REACT_APP_USE_TLS ? "http://" + process.env.REACT_APP_BACKEND_HOST + ":" + process.env.REACT_APP_BACKEND_PORT : "https://127.0.0.1:" + process.env.REACT_APP_BACKEND_PORT;

    // For all methods, wait 10 seconds before timing out
    this.timeout = 10000
  }

  async list(streetId: number, plotId: number) : Promise<[number, string, IBuildingArr]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let buildings: IBuildingArr = [];
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/street/" + streetId + "/" + plotId + "/",
      { timeout: this.timeout,
      })
      .then(response => {
        buildings = response.data.result;
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
    return [responseStatus, responseError, buildings]
  }

  async create(streetId: number, plotId: number, streetNumber: string, postalCode: string, type: string, areaSize: number, floorCount: number, year: number, price: number) : Promise<[number, string]>  {    
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    try {
    await new Promise((resolve, reject) => axios
      .post(this.host + "/api/street/" + streetId + "/" + plotId, {
        streetNumber,
        postalCode,
        type,
        areaSize,
        floorCount,
        year,
        price,
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

  async read(streetId: number, plotId: number, buildingId: number) : Promise<[number, string, IBuilding]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let building: IBuilding = {
      id: 0,
      userId: 0,
      streetId: 0,
      plotId: 0,
      streetNumber: "",
      postalCode: "",
      type: "",
      areaSize: 0,
      floorCount: 0,
      year: 0,
      price: 0,
      
    };
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/street/" + streetId + "/" + plotId + "/" + buildingId,
      { timeout: this.timeout,
      })
      .then(response => {
        building = response.data.result;
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
    return [responseStatus, responseError, building]
  }

  
  async update(streetId: number, plotId: number, buildingId: number, streetNumber: string, postalCode: string, type: string, areaSize: number, floorCount: number, year: number, price: number) : Promise<[number, string, IBuilding]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    let building: IBuilding = {
      id: 0,
      userId: 0,
      streetId: 0,
      plotId: 0,
      streetNumber: "",
      postalCode: "",
      type: "",
      areaSize: 0,
      floorCount: 0,
      year: 0,
      price: 0,
    };

    try {
    await new Promise((resolve, reject) => axios
      .put(this.host + "/api/street/" + streetId + "/" + plotId + "/" + buildingId, {
        streetNumber,
        postalCode,
        type,
        areaSize,
        floorCount,
        year,
        price,
      },
      { timeout: this.timeout,
        headers: authHeader(),
      })
      .then(response => {
        building = response.data.result;
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
    return [responseStatus, responseError, building]
  }

  async remove(streetId: number, plotId: number, buildingId: number) : Promise<[number, string]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    try {
    await new Promise((resolve, reject) => axios
      .delete(this.host + "/api/street/" + streetId + "/" + plotId + "/" + buildingId,
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

export default new Building();