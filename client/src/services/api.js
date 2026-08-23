/**
 * CyberShield AI - API & Database Bridge Service
 */

import axios from 'axios';
import { io } from 'socket.io-client';
import { BrowserDatabase } from './dbStore';

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

// Intercept Responses to Fallback to Client Database when API server is offline
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config || {};
    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    // 1. Scan History Request
    if (url.includes('/scans/history')) {
      const history = BrowserDatabase.getScans();
      return Promise.resolve({ data: history });
    }

    // 2. Admin Metrics Request
    if (url.includes('/admin/metrics')) {
      const metrics = BrowserDatabase.getMetrics();
      return Promise.resolve({ data: metrics });
    }

    // 3. SQL Stats Request
    if (url.includes('/sql/stats')) {
      const stats = BrowserDatabase.getSqlStats();
      return Promise.resolve({ data: stats });
    }

    // 4. SQL Tables Request
    if (url.includes('/sql/tables')) {
      const tables = BrowserDatabase.getSqlTables();
      return Promise.resolve({ data: tables });
    }

    // 5. SQL Query Request
    if (url.includes('/sql/query')) {
      let bodyData = {};
      try {
        bodyData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
      } catch (e) {
        bodyData = {};
      }
      const queryResult = BrowserDatabase.executeQuery(bodyData.query);
      return Promise.resolve({ data: queryResult });
    }

    // 6. Incident Report Submission Request
    if (url.includes('/incidents') && method === 'post') {
      let bodyData = {};
      try {
        bodyData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
      } catch (e) {
        bodyData = {};
      }
      const savedInc = BrowserDatabase.saveIncident(bodyData);
      return Promise.resolve({ data: savedInc });
    }

    return Promise.reject(error);
  }
);

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
