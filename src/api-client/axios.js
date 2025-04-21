import AuthTokenService from "../utils/AuthTokenService";
import axios from "axios";
var tokenObj = AuthTokenService.get();
// var tokenObj = AuthTokenService.clear()

export const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,

  headers: {
    Authorization: "Bearer " + tokenObj,
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
});

export const apiClient1 = axios.create({
  baseURL: process.env.API_BASE_URL,

  
});

export const apiClientAi = axios.create({
  baseURL: process.env.AI_BASE_URL,
})

apiClientAi.interceptors.request.use(
  (config) => {
    const tokenObj = AuthTokenService.get(); 
    if (tokenObj) {
      config.headers.Authorization = `Bearer ${tokenObj}`;
    }
    config.headers.Accept = "application/json";
    config.headers["Content-Type"] = "application/json; charset=utf-8";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClientAi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("Response Error:", error.response.data);
      console.error("Status Code:", error.response.status);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request Error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);