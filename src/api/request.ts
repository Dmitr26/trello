import axios from 'axios';
import api from '../common/constants/api';

const instance = axios.create({
    baseURL: api.baseURL,
    headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Bearer 123', // до цього ми ще повернемося якось потім
    },
});

instance.interceptors.request.use(request => {
    const accessToken = localStorage.getItem('authToken');
    if (accessToken) {
        request.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return request;
}, error => {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await instance.post('/refresh', {
                    refreshToken: refreshToken,
                });
                const { token: accessToken, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem('authToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;