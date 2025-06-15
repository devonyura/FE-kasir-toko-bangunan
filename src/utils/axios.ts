// src/utils/axios.ts
import axios from "axios";
import { useAuthStore } from "../store/auth";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Optional: Auto attach token to every request if available
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = "application/json"
  return config;
});
