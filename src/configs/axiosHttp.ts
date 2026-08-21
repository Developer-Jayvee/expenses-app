import axios from "axios";
import ServerStatusService from "@c/services/ServerStatusService";
const base_url = import.meta.env.VITE_BASE_URL_API;

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
  (response) => {
    ServerStatusService.reportUp();
    return response?.data;
  },
  (error) => {
    const status = error?.response?.status;
    const hasResponse = Boolean(error?.response);
    const isServerError = typeof status === "number" && status >= 500;

    if (!hasResponse) {
      ServerStatusService.reportDown(
        "We can't reach the server. Check your connection or try again shortly.",
      );
    } else if (isServerError) {
      ServerStatusService.reportDown(
        "The server is having trouble right now. Please try again shortly.",
      );
    }

    return Promise.reject(error);
  },
);

export default http;
