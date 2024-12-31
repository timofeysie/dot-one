import axios from "axios";

axios.defaults.baseURL = "https://drf-two-eb17ecbff99f.herokuapp.com/";
// axios.defaults.baseURL = "https://drf-api-rec.herokuapp.com/";
// axios.defaults.baseURL = "https://unified-moments.herokuapp.com/";
// axios.defaults.baseURL = "http://127.0.0.1:8000/"; // running locally
// axios.defaults.baseURL = "http://localhost:3001"; // running Nest backend locally
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosNest = axios.create({
  baseURL: "https://api.mcayreserve.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000
});

// Keep your existing interceptor
axiosNest.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const axiosReq = axios.create();
export const axiosRes = axios.create();
