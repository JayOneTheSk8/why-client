import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_WHY_SERVER_BASE_URL,
  headers: { 'CLIENT-TOKEN': process.env.REACT_APP_CLIENT_TOKEN }
});
