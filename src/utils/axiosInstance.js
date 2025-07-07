import axios from 'axios';
import getBaseUrl from './baseURL';

const axiosInstance = axios.create({
  baseURL: getBaseUrl(),
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    if (token) {
      // Check if the token is expired
      const decodedToken = decodeToken(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        // Token is expired, refresh it
        token = await refreshToken();
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export default axiosInstance;
