import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 90_000,
});

export const getApiErrorMessage = (error, fallback) => error?.response?.data?.error?.message || error?.response?.data?.error || fallback;

export const reviewWebsite = (url, force = false) => api.post("/reviews/website", { url, force });
export const reviewCode = (language, code) => api.post("/reviews/code", { language, code });
export const askMentor = (question, context) => api.post("/mentor", { question, context });

export default api;
