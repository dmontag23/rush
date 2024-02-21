import axios from 'axios';
import {TODAY_TIX_API_BASE_URL} from '@env';

export const todayTixAPI = axios.create({
  baseURL: TODAY_TIX_API_BASE_URL,
  headers: {'Content-Type': 'application/json'}
});

todayTixAPI.interceptors.response.use(
  response => response.data.data,
  errorResponse => Promise.reject(errorResponse.response.data)
);
