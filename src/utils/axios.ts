// src/utils/axios.ts
import axios from "axios";
import { useAuthStore } from "../store/auth";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  // baseURL: "https://api.buanadapurang.id/api",
});

// Optional: Auto attach token to every request if available
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = "application/json"
  return config;
});

// Intercept response for token expired
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const auth = useAuthStore.getState();
      auth.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
