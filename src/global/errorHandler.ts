// helper function for handling axios errors
export const errorHandler = (error: { request: any; response: any; }) => {
  const { request, response } = error;

  console.log("errorHandler", response)

  if (response.data) {
    if (response.data.error) {
      return {
        responseMsg: response.data.error,
        status: response.status,
      };
    }
    return {
      responseMsg: response.data,
      status: response.status,
    };
  } else if (request) {
    //request sent but no response received
    return {
      responseMsg: "server timed out",
      status: 503,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return { responseMsg: "something went wrong while setting up request on client side" };
  }
}