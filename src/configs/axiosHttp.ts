import axios from "axios";

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_API,
  timeout: 500,
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
