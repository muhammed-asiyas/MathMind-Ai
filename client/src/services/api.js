import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const trimmedBaseUrl = configuredBaseUrl.replace(/\/+$/, "");
const apiBaseUrl = /\/api$/i.test(trimmedBaseUrl)
  ? trimmedBaseUrl
  : `${trimmedBaseUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default api;