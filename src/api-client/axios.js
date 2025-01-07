

import AuthTokenService from "../utils/AuthTokenService"
import axios from "axios"
var tokenObj = AuthTokenService.get()

export const apiClient = axios.create({
    baseURL: process.env.API_BASE_URL,
  
    headers: {
        Authorization: "Bearer " + tokenObj,
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
});

export const apiClient1 = axios.create({
  baseURL: process.env.API_BASE_URL,


});


