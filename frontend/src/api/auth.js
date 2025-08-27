import axios from "axios";

const api = axios.create({
   baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});

export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");
export const fetchUser = () => api.get("/auth/onBoarding");
