import axios from "axios";

axios.defaults.baseURL = "https://drf-two-eb17ecbff99f.herokuapp.com/";
// axios.defaults.baseURL = "https://drf-api-rec.herokuapp.com/";
// axios.defaults.baseURL = "https://unified-moments.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();