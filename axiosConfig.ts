import axios from 'axios';
import config from './config.json';

export const todayTixAPI = axios.create({
  baseURL: config.todayTixAPIBaseUrl,
  headers: {'Content-Type': 'application/json'}
});

todayTixAPI.interceptors.response.use(
  response => response.data,
  errorResponse => Promise.reject(errorResponse.response.data)
);
