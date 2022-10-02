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

  async list() : Promise<[number, string, IBuildingArr]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let buildings: IBuildingArr = [];
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/building/all",
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

  async create(streetName: string, lotNo: number, streetNumber: string, type: string, areaSize: number, floorCount: number, year: number, price: number) : Promise<[number, string]>  {    
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    try {
    await new Promise((resolve, reject) => axios
      .post(this.host + "/api/user/building", {
        streetName,
        lotNo,
        streetNumber,
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

  async read(streetName: string, lotNo: number, streetNumber: string) : Promise<[number, string, IBuilding]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"];
    let building: IBuilding = {
      id: 0,
      userId: 0,
      streetName: "",
      lotNo: 0,
      streetNumber: "",
      type: "",
      areaSize: 0,
      floorCount: 0,
      year: 0,
      price: 0,
      
    };
    try {
    await new Promise((resolve, reject) => axios
      .get(this.host + "/api/building",
      { timeout: this.timeout,
        params: {
          streetName: streetName,
          lotNo: lotNo,
          streetNumber: streetNumber,
        }
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

  
  async update(streetName: string, lotNo: number, streetNumber: string, type: string, areaSize: number, floorCount: number, year: number, price: number) : Promise<[number, string, IBuilding]>  {
    let [responseStatus, responseError] = [400, "something went wrong client side"]
    let building: IBuilding = {
      id: 0,
      userId: 0,
      streetName: "",
      lotNo: 0,
      streetNumber: "",
      type: "",
      areaSize: 0,
      floorCount: 0,
      year: 0,
      price: 0,
    };

    try {
    await new Promise((resolve, reject) => axios
      .put(this.host + "/api/user/building", {
        streetName,
        lotNo,
        streetNumber,
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

  async remove(streetName: string, lotNo: number, streetNumber: string, notAdmin: boolean) : Promise<[number, string]>  {
    let path: string = "";
    if (notAdmin === true) {
      path = "/api/user/building/remove";
    } else {
      path = "/api/admin/building/remove";
    }

    let [responseStatus, responseError] = [400, "something went wrong client side"];
    try {
    await new Promise((resolve, reject) => axios
      .delete(this.host + path,
      { timeout: this.timeout,
        headers: authHeader(),
        params: {
          streetName: streetName,
          lotNo: lotNo,
          streetNumber: streetNumber,
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

export default new Building();