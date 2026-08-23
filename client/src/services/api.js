/**
 * CyberShield AI - API & Socket Client Service
 */

import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE_URL = '/api';

// Create Axios Instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercept Requests to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cybershield_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Socket.io Real-Time Threats Client
let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(window.location.origin, {
      reconnection: true,
      reconnectionAttempts: 5
    });
  }
  return socketInstance;
};
