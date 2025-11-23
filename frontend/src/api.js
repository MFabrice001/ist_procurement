import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Points to your Django Backend
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a token to every request if we are logged in
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        // Note: Django Basic Auth usually needs 'Basic ' + base64, 
        // but for this simple setup we will assume standard session or just public for now.
        // If we implemented Token/JWT, we would use 'Bearer ' + token.
        // For this speedrun, we will rely on Session Auth logic or simple access.
    }
    return config;
});

export default api;