
import axios from "axios";

export const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:8888";

console.log("BASE_URL =", BASE_URL); 

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 400) {
      localStorage.removeItem("token");
      window.location.replace("/");
    }
    return Promise.reject(error);
  }
);
