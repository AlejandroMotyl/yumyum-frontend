import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://nodejs-hw-zdyd.onrender.com/api/',
  withCredentials: true,
});
