-- ====================================================================
-- 🛡️ CyberShield AI - Production Relational SQL Database Schema (3NF)
-- Compatible with SQLite3, PostgreSQL, MySQL, and MariaDB
-- ====================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT DEFAULT '',
  password_hash TEXT NOT NULL,
  otp TEXT DEFAULT NULL,
  is_verified INTEGER DEFAULT 1,
  security_score INTEGER DEFAULT 88 CHECK(security_score BETWEEN 0 AND 100),
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
  last_login_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  login_count INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Activity & Login Audit Log Table
CREATE TABLE IF NOT EXISTS user_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT DEFAULT '',
  role TEXT DEFAULT 'user',
  action_type TEXT DEFAULT 'LOGIN' CHECK(action_type IN ('REGISTER', 'LOGIN', 'LOGOUT')),
  ip_address TEXT DEFAULT '127.0.0.1',
  status TEXT DEFAULT 'Success',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Scans Threat History Master Table
CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY,
  user_id TEXT DEFAULT 'anonymous',
  username TEXT DEFAULT 'Demo User',
  scan_type TEXT NOT NULL,
  input_data TEXT NOT NULL,
  threat_type TEXT NOT NULL,
  risk_score INTEGER NOT NULL CHECK(risk_score BETWEEN 0 AND 100),
  confidence INTEGER NOT NULL CHECK(confidence BETWEEN 0 AND 100),
  risk_level TEXT NOT NULL,
  risk_color TEXT DEFAULT '#10B981',
  recommendation TEXT NOT NULL,
  scam_type TEXT DEFAULT NULL,
  brand_detected TEXT DEFAULT NULL,
  decoded_url TEXT DEFAULT NULL,
  domain_age TEXT DEFAULT NULL,
  ssl_status TEXT DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Scan Detection Reasons & Action Items (1-to-N Normalized Relation)
CREATE TABLE IF NOT EXISTS scan_reasons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scan_id TEXT NOT NULL,
  reason_text TEXT NOT NULL,
  is_action_item INTEGER DEFAULT 0,
  FOREIGN KEY (scan_id) REFERENCES scans(id) ON DELETE CASCADE
);

-- 5. Incident Reports Table
CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY,
  ticket_id TEXT UNIQUE NOT NULL,
  user_id TEXT DEFAULT 'anonymous',
  username TEXT DEFAULT 'Victim User',
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  target_url_or_phone TEXT DEFAULT NULL,
  loss_amount REAL DEFAULT 0.0,
  status TEXT DEFAULT 'Under Investigation' CHECK(status IN ('Open', 'Under Investigation', 'Resolved', 'Dismissed')),
  severity TEXT DEFAULT 'High' CHECK(severity IN ('Low', 'Medium', 'High', 'Critical')),
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Threat Intelligence Feeds Table
CREATE TABLE IF NOT EXISTS threat_intelligence_feeds (
  id TEXT PRIMARY KEY,
  indicator TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('URL', 'Domain', 'IP', 'Keyword', 'Phone')),
  risk_level TEXT DEFAULT 'High',
  source TEXT DEFAULT 'CyberShield Threat Network',
  description TEXT DEFAULT '',
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. System Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- SQL PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_scans_threat_risk ON scans(risk_score, threat_type);
CREATE INDEX IF NOT EXISTS idx_scans_user_date ON scans(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_scans_type ON scans(scan_type);
CREATE INDEX IF NOT EXISTS idx_incidents_ticket ON incidents(ticket_id);
CREATE INDEX IF NOT EXISTS idx_user_logs_user ON user_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_threat_feeds_indicator ON threat_intelligence_feeds(indicator);

-- ====================================================================
-- SQL ANALYTICAL VIEWS
-- ====================================================================

-- View 1: Real-time Threat Intelligence Analytics by Scan Module
CREATE VIEW IF NOT EXISTS v_threat_analytics AS
SELECT 
  scan_type,
  COUNT(*) AS total_scans,
  SUM(CASE WHEN risk_score > 70 THEN 1 ELSE 0 END) AS high_threats_detected,
  SUM(CASE WHEN risk_score BETWEEN 40 AND 70 THEN 1 ELSE 0 END) AS suspicious_scans,
  SUM(CASE WHEN risk_score < 40 THEN 1 ELSE 0 END) AS clean_scans,
  ROUND(AVG(risk_score), 1) AS avg_risk_score,
  ROUND(AVG(confidence), 1) AS avg_confidence
FROM scans
GROUP BY scan_type;

-- View 2: Cyber Crime Incident SLA & Financial Loss Breakdown
CREATE VIEW IF NOT EXISTS v_incident_sla_status AS
SELECT
  severity,
  status,
  COUNT(*) AS ticket_count,
  SUM(loss_amount) AS total_financial_loss,
  ROUND(AVG(loss_amount), 2) AS avg_loss_per_incident
FROM incidents
GROUP BY severity, status;

-- View 3: User Risk & Security Activity Profiles
CREATE VIEW IF NOT EXISTS v_user_security_profiles AS
SELECT
  u.id,
  u.username,
  u.email,
  u.role,
  u.security_score,
  u.login_count,
  u.last_login_at,
  COUNT(s.id) AS total_scans_conducted,
  ROUND(AVG(COALESCE(s.risk_score, 0)), 1) AS avg_threat_level
FROM users u
LEFT JOIN scans s ON u.id = s.user_id
GROUP BY u.id;
