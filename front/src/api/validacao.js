import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:418",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export default api;