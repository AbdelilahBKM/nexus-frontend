import axios from "axios";

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/", // Set your backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle CORS (Optional, server-side CORS handling should also be in place)
axiosInstance.interceptors.request.use(
  (config) => {
    // Optionally set Authorization header if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally (you can add more error handling here)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error in setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);