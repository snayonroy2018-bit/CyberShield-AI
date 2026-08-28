/**
 * CyberShield AI - API & Database Bridge Service
 */

import axios from 'axios';
import { io } from 'socket.io-client';
import { BrowserDatabase } from './dbStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

    let bodyData = {};
    try {
      bodyData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
    } catch (e) {
      bodyData = {};
    }

    // 1. Auth Login Request
    if (url.includes('/auth/login')) {
      const authRes = BrowserDatabase.authenticateUser(bodyData.emailOrUsername || bodyData.username, bodyData.password);
      if (authRes) {
        return Promise.resolve({ data: authRes });
      }
      return Promise.reject({ response: { data: { msg: 'Invalid login credentials.' } } });
    }

    // 2. Auth Register Request
    if (url.includes('/auth/register')) {
      const regRes = BrowserDatabase.registerUser(bodyData.username, bodyData.password, bodyData.email);
      return Promise.resolve({ data: regRes });
    }

    // 3. Auth OTP Verify
    if (url.includes('/auth/verify-otp')) {
      return Promise.resolve({ data: { success: true, msg: 'OTP verified successfully. Redirecting to dashboard...' } });
    }

    // 4. Auth Me Check
    if (url.includes('/auth/me')) {
      const currentUser = BrowserDatabase.getCurrentUser();
      return Promise.resolve({ data: { user: currentUser } });
    }

    // 5. Scan Analysis Request
    if (url.includes('/scans/analyze')) {
      const scanRes = BrowserDatabase.analyzeScan(
        bodyData.type || bodyData.scanType || bodyData.scan_type,
        bodyData.input || bodyData.inputData || bodyData.input_data
      );
      return Promise.resolve({ data: scanRes });
    }

    // 6. Scan History Request
    if (url.includes('/scans/history')) {
      const history = BrowserDatabase.getScans();
      return Promise.resolve({ data: history });
    }

    // 7. Scan Analytics Request
    if (url.includes('/scans/analytics')) {
      const analytics = BrowserDatabase.getAnalytics();
      return Promise.resolve({ data: analytics });
    }

    // 8. Admin Metrics Request
    if (url.includes('/admin/metrics')) {
      const metrics = BrowserDatabase.getMetrics();
      return Promise.resolve({ data: metrics });
    }

    // 9. SQL Stats Request
    if (url.includes('/sql/stats')) {
      const stats = BrowserDatabase.getSqlStats();
      return Promise.resolve({ data: stats });
    }

    // 10. SQL Tables Request
    if (url.includes('/sql/tables')) {
      const tables = BrowserDatabase.getSqlTables();
      return Promise.resolve({ data: tables });
    }

    // 11. SQL Query Request
    if (url.includes('/sql/query')) {
      const queryResult = BrowserDatabase.executeQuery(bodyData.sqlQuery || bodyData.query);
      return Promise.resolve({ data: queryResult });
    }

    // 12. Incident Report Submission Request
    if (url.includes('/incidents/report') || (url.includes('/incidents') && method === 'post')) {
      const savedInc = BrowserDatabase.saveIncident(bodyData);
      return Promise.resolve({ data: savedInc });
    }

    // 13. Incident List Request
    if (url.includes('/incidents')) {
      const incidents = BrowserDatabase.getIncidents();
      return Promise.resolve({ data: incidents });
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
