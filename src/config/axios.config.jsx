import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.MUSIC_BACKEND_BASE_URL || 'http://localhost:3000', // Use environment variables for flexibility
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000, // Set a default timeout
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});