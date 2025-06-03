import axios from "axios";
import { useLocation } from 'react-router-dom';

const api = axios.create({
    baseURL: "http://localhost:6080", // Base URL for all API calls
    headers: { "Content-Type": "application/json", },
});

// Attach Authorization token dynamically for every request
api.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem("token"));
        if (token) { config.headers.Authorization = `Bearer ${token}`; }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
