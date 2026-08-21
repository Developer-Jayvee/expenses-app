import axios from "axios";
const base_url = import.meta.env.VITE_BASE_URL_API;

console.log(base_url);
const http = axios.create({
  baseURL: base_url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

http.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);
http.interceptors.response.use(
  (response) => response?.data,
  (error) => Promise.reject(error),
);

export default http;
