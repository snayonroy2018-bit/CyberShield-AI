/**
 * CyberShield AI - Express Backend & Real-Time Socket Server
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
require('dotenv').config();

const authMiddleware = require('./middleware/auth');
const adminAuth = require('./middleware/adminAuth');
const authController = require('./controllers/authController');
const scanController = require('./controllers/scanController');
const incidentController = require('./controllers/incidentController');
const adminController = require('./controllers/adminController');
const sqlController = require('./controllers/sqlController');
const sqlDb = require('../database/sqlDb');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Port configuration
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cybershield';

// Initialize Relational SQL Engine
sqlDb.initDb().then(ok => {
  if (ok) console.log('🏛️  Relational SQL Engine initialized & operational.');
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Attach Socket.io to request object for live threat broadcasting
app.use((req, res, next) => {
  req.io = io;
  next();
});

// MongoDB Connection Attempt with graceful fallback
mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('✅ MongoDB database connected successfully.');
    if (typeof authController.seedMongoUsers === 'function') {
      await authController.seedMongoUsers();
    }
  })
  .catch((err) => console.log('⚠️ MongoDB not connected (running in Relational SQL + In-Memory fallback mode).'));

// API Routes
// Auth Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/send-otp', authController.sendOTP);
app.post('/api/auth/verify-otp', authController.verifyOTP);
app.post('/api/auth/resend-otp', authController.resendOTP);
app.post('/api/auth/forgot-password', authController.forgotPassword);
app.get('/api/auth/me', authMiddleware, authController.getMe);

// Scan Routes
app.post('/api/scans/analyze', authMiddleware, scanController.analyzeScan);
app.get('/api/scans/history', authMiddleware, scanController.getScanHistory);
app.get('/api/scans/analytics', authMiddleware, scanController.getAnalytics);
app.post('/api/scans/refresh-increment', scanController.triggerRefreshIncrement);

// Incident Routes
app.post('/api/incidents/report', authMiddleware, incidentController.submitIncident);
app.get('/api/incidents/list', authMiddleware, incidentController.getIncidents);

// Admin Routes (Strictly protected for System Administrator)
app.get('/api/admin/metrics', [authMiddleware, adminAuth], adminController.getAdminMetrics);
app.get('/api/admin/users', [authMiddleware, adminAuth], adminController.getRegisteredUsers);
app.get('/api/admin/user-logs', [authMiddleware, adminAuth], adminController.getUserLogs);

// SQL Database & Console Routes
app.get('/api/sql/stats', [authMiddleware, adminAuth], sqlController.getSqlStats);
app.get('/api/sql/tables', [authMiddleware, adminAuth], sqlController.getSqlTables);
app.post('/api/sql/query', [authMiddleware, adminAuth], sqlController.executeSqlQuery);
app.get('/api/sql/analytics', [authMiddleware, adminAuth], sqlController.getSqlAnalytics);

// System Health Check
app.get('/api/health', async (req, res) => {
  const sqlStats = await sqlDb.getStats();
  res.json({
    status: 'online',
    system: 'CyberShield AI Express Server',
    database: {
      mongo: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'In-Memory Fallback Active',
      sql: sqlStats.status === 'Operational' ? 'SQLite3 Relational Engine Active' : 'Offline',
      sqlCounts: sqlStats.counts
    },
    timestamp: new Date()
  });
});

// Socket.io Real-time Monitoring Connections
io.on('connection', (socket) => {
  console.log(`🔌 Client connected to CyberShield Live Socket: ${socket.id}`);
  
  socket.emit('system_status', {
    status: 'Operational',
    monitoring: 'Live SMS, Email, URL & Network Packet Stream Active'
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`🛡️ CyberShield Express Server running on http://127.0.0.1:${PORT}`);
});
