import axios from "axios";
import { API_URL } from "../config/env";

export const TOKEN_KEY = "dungeonfit_token";
export const USER_KEY = "dungeonfit_user";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401 && !currentPath.includes("/login")) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);

export default api;
