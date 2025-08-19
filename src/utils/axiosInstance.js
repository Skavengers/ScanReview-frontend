import axios from 'axios';
import getBaseUrl from './baseURL';

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
});

// Function to refresh the token
const refreshToken = async () => {
  try {
    //const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${getBaseUrl()}/api/auth/refresh`, { refreshToken });
    const newToken = response.data.accessToken;

    // Store the new token
    localStorage.setItem('token', newToken);

    return newToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Redirect to login or handle the error appropriately
    window.location.href = '/login';
    return null;
  }
};

// Function to decode the token
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post('/auth/refresh', {
          refreshToken: localStorage.getItem('refreshToken'),
        });
        const newToken = res.data.accessToken;
        localStorage.setItem('token', newToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error('Token refresh failed', err);
      }
    }

    return Promise.reject(error);
  }
);


axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.exp * 1000 < Date.now()) {
        // Token is expired, refresh it
        token = await refreshToken();
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
