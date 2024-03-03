import axios from "axios";

export const todayTixAPI = axios.create({
  baseURL: process.env.TODAY_TIX_API_BASE_URL,
  headers: {"Content-Type": "application/json"}
});

todayTixAPI.interceptors.response.use(
  response => response.data.data,
  errorResponse => Promise.reject(errorResponse.response.data)
);
