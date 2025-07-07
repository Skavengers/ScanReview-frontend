// src/utils/authUtils.js

import axios from 'axios';
import getBaseUrl from './baseURL';

export const refreshToken = async () => {
  try {
    const response = await axios.post(`${getBaseUrl()}/auth/refresh-token`, {
      token: localStorage.getItem('refreshToken'),
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

export const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
