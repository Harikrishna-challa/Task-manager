import axios from "axios";

const baseURL =process.env.BACKEND_URL

// Create an Axios instance with default base UR
const axiosInstance = axios.create({
  baseURL:baseURL, // Make sure it's baseURL
  withCredentials: true, //  Send cookies or Authorization headers
});

// Add an interceptor to attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
  }
  return config; // Return modified config
});

export default axiosInstance; // Export configured Axios instance
