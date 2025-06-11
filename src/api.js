import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';

const api = axios.create({
    baseURL: "http://localhost:6080", // Base URL for all API calls
    headers: { "Content-Type": "application/json", },
});

let currentToken = null;

export const setAuthToken = (token) => {
    currentToken = token;
};

// Attach Authorization token dynamically for every request
api.interceptors.request.use(
    (config) => {
        // const token = useSelector((state) => { state.login.token })
        // const token = JSON.parse(localStorage.getItem("token"));
        // if (token) { config.headers.Authorization = `Bearer ${token}`; }
        console.log(currentToken);
        if (currentToken) { config.headers.Authorization = `Bearer ${currentToken}`; }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
