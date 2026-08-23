/**
 * CyberShield AI - Database Models & Schema Specifications
 * Supports both MongoDB / Mongoose ODM and in-memory fallback persistence.
 */

let mongoose;
try {
  mongoose = require('mongoose');
} catch (e) {
  try {
    mongoose = require('../server/node_modules/mongoose');
  } catch (e2) {
    mongoose = null;
  }
}

let User, Scan, Incident, UserLog;

if (mongoose) {
  // User Schema Definition
  const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, default: '' },
    password: { type: String, required: true },
    otp: { type: String, default: null },
    isVerified: { type: Boolean, default: true },
    securityScore: { type: Number, default: 88 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    lastLoginAt: { type: Date, default: Date.now },
    loginCount: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
  });

  // User Login/Activity Log Schema Definition
  const UserLogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, default: '' },
    role: { type: String, default: 'user' },
    actionType: { type: String, enum: ['REGISTER', 'LOGIN', 'LOGOUT'], default: 'LOGIN' },
    ipAddress: { type: String, default: '127.0.0.1' },
    status: { type: String, default: 'Success' },
    timestamp: { type: Date, default: Date.now }
  });

  // Scan History Schema Definition
  const ScanSchema = new mongoose.Schema({
    userId: { type: String, default: 'anonymous' },
    username: { type: String, default: 'Demo User' },
    scanType: { type: String, required: true },
    input: { type: String, required: true },
    threatType: { type: String, required: true },
    riskScore: { type: Number, required: true },
    confidence: { type: Number, required: true },
    riskClassification: {
      level: String,
      color: String,
      class: String
    },
    reasons: [{ type: String }],
    recommendation: { type: String, required: true },
    actionItems: [{ type: String }],
    scamType: { type: String },
    brandDetected: { type: String },
    decodedUrl: { type: String },
    domainAge: { type: String },
    sslStatus: { type: String },
    date: { type: Date, default: Date.now }
  });

  // Incident Report Schema Definition
  const IncidentSchema = new mongoose.Schema({
    userId: { type: String, default: 'anonymous' },
    username: { type: String, default: 'Victim User' },
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    targetUrlOrPhone: { type: String },
    lossAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['Open', 'Under Investigation', 'Resolved', 'Dismissed'], default: 'Under Investigation' },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'High' },
    ticketId: { type: String, required: true, unique: true },
    submittedAt: { type: Date, default: Date.now }
  });

  User = mongoose.models.User || mongoose.model('User', UserSchema);
  UserLog = mongoose.models.UserLog || mongoose.model('UserLog', UserLogSchema);
  Scan = mongoose.models.Scan || mongoose.model('Scan', ScanSchema);
  Incident = mongoose.models.Incident || mongoose.model('Incident', IncidentSchema);
} else {
  // Dummy class constructors for fallback mode
  User = class User { constructor(data) { Object.assign(this, data); } save() { return Promise.resolve(this); } static findOne() { return Promise.resolve(null); } static find() { return Promise.resolve([]); } };
  UserLog = class UserLog { constructor(data) { Object.assign(this, data); } save() { return Promise.resolve(this); } static find() { return { sort: () => Promise.resolve([]) }; } };
  Scan = class Scan { constructor(data) { Object.assign(this, data); } save() { return Promise.resolve(this); } static find() { return { sort: () => ({ limit: () => Promise.resolve([]) }) }; } };
  Incident = class Incident { constructor(data) { Object.assign(this, data); } save() { return Promise.resolve(this); } static find() { return { sort: () => Promise.resolve([]) }; } };
}

module.exports = { User, UserLog, Scan, Incident };
