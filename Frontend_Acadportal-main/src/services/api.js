import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login:  (email, password) => api.post("/login", { email, password }),
  logout: ()               => api.post("/logout"),
  me:     ()               => api.get("/me"),
};

export const studentsApi = {
  getAll:  (params) => api.get("/students", { params }),
  create:  (data)   => api.post("/students", data),
  update:  (id, data) => api.put(`/students/${id}`, data),
  remove:  (id)     => api.delete(`/students/${id}`),
};

export const coursesApi = {
  getAll:  (params) => api.get("/courses", { params }),
  create:  (data)   => api.post("/courses", data),
  update:  (id, data) => api.put(`/courses/${id}`, data),
  remove:  (id)     => api.delete(`/courses/${id}`),
};

export const dashboardApi = {
  getStats: () => api.get("/dashboard/stats"),
};

export default api;
