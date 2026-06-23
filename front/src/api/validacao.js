import axios from "axios";

const urlApi = import.meta.env.VITE_LINK_BASE_API || "http://localhost:418"

const api = axios.create({
  baseURL: urlApi,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario')
      window.location.href = '/acesso-negado';
    }
    return Promise.reject(error);
  }
);

export default api;