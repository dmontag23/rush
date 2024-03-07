import axios from "axios";

import {handleTodayTixApiRequest} from "./utils";

export const todayTixOAuthAPI = axios.create({
  baseURL: `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_OAUTH_ENDPOINT}`,
  headers: {"Content-Type": "application/x-www-form-urlencoded"}
});

todayTixOAuthAPI.interceptors.response.use(
  response => response.data,
  errorResponse => Promise.reject(errorResponse.response.data)
);

export const todayTixAPIv2 = axios.create({
  baseURL: `${process.env.TODAY_TIX_API_BASE_URL}${process.env.TODAY_TIX_API_V2_ENDPOINT}`,
  headers: {"Content-Type": "application/json"}
});

todayTixAPIv2.interceptors.request.use(handleTodayTixApiRequest);

todayTixAPIv2.interceptors.response.use(
  response => response.data.data,
  errorResponse => Promise.reject(errorResponse.response.data)
);
