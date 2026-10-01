import axios from "axios";

// Create Axios client instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can attach tokens or auth headers here when implemented
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || "Something went wrong",
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(customError);
  }
);

export default api;
