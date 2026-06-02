import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  timeout: 8000,
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("matbong_admin_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
