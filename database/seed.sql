-- ====================================================================
-- 🛡️ CyberShield AI - Enterprise Relational SQL Seed Dataset
-- Includes realistic threat scans, users, incidents, and threat intelligence
-- ====================================================================

-- 1. Insert Initial System Users
INSERT OR REPLACE INTO users (id, username, email, password_hash, otp, is_verified, security_score, role, last_login_at, login_count, created_at)
VALUES 
('user_admin_001', 'Snayon Roy', 'snayonroy2018@gmail.com', '$2a$10$wT5W2E59l6OqJ7yFm23uJ.Xm4xH3Yp/1R7B3xS6N90P1Q2R3S4T5U', NULL, 1, 99, 'admin', CURRENT_TIMESTAMP, 14, CURRENT_TIMESTAMP),
('user_admin_002', 'admin', 'admin@cybershield.ai', '$2a$10$adminHash123456789012345678901234567890', NULL, 1, 99, 'admin', CURRENT_TIMESTAMP, 10, CURRENT_TIMESTAMP),
('user_demo_002', 'demouser', 'demouser@cybershield.ai', '$2a$10$vP6V1D48k5NpI6xE12tI.Wl3wG2Xo/0Q6A2xR5M89O0P1Q2R3S4T', NULL, 1, 88, 'user', CURRENT_TIMESTAMP, 8, CURRENT_TIMESTAMP),
('user_analyst_003', 'alex_cyber', 'alex.analyst@cybershield.ai', '$2a$10$uO5U0C37j4MoH5xD01sH.Vk2vF1Xn/9P5z1wQ4L78N9O0P1Q2R3S', NULL, 1, 95, 'admin', CURRENT_TIMESTAMP, 5, CURRENT_TIMESTAMP);

-- 2. Insert User Login Audit Logs
INSERT OR REPLACE INTO user_logs (id, user_id, username, email, role, action_type, ip_address, status, created_at)
VALUES
('log_101', 'user_admin_001', 'Snayon Roy', 'snayonroy@cybershield.ai', 'admin', 'LOGIN', '127.0.0.1', 'Success (Super Admin)', CURRENT_TIMESTAMP),
('log_102', 'user_demo_002', 'demouser', 'demouser@cybershield.ai', 'user', 'LOGIN', '192.168.1.45', 'Success', CURRENT_TIMESTAMP),
('log_103', 'user_analyst_003', 'alex_cyber', 'alex.analyst@cybershield.ai', 'admin', 'LOGIN', '10.0.4.12', 'Success', CURRENT_TIMESTAMP);

-- 3. Insert Historical Threat Scans across all 8 Attack Vectors
INSERT OR REPLACE INTO scans (id, user_id, username, scan_type, input_data, threat_type, risk_score, confidence, risk_level, risk_color, recommendation, scam_type, brand_detected, decoded_url, domain_age, ssl_status, created_at)
VALUES
('scan_001', 'user_admin_001', 'Snayon Roy', 'url', 'https://amaz0n-secure-login.xyz', 'Phishing Website', 96, 95, 'CRITICAL THREAT', '#EF4444', 'DO NOT ENTER CREDENTIALS. Block domain immediately in network firewall.', 'Credential Theft', 'Amazon', 'https://amaz0n-secure-login.xyz', '3 Days', 'Invalid / Self-Signed', CURRENT_TIMESTAMP),

('scan_002', 'user_demo_002', 'demouser', 'email', 'From: support@paytm-securityverify.com | Subject: Account Suspended! Verify NOW', 'Phishing Email', 94, 92, 'HIGH RISK THREAT', '#EF4444', 'Do not click links or reply. Report to security team.', 'Banking Scam', 'Paytm', 'https://paytm-securityverify.com/login', '5 Days', 'Expired', CURRENT_TIMESTAMP),

('scan_003', 'user_demo_002', 'demouser', 'sms', 'Congratulations! You won ₹10,00,000 in SBI Lucky Draw. Click http://bit.ly/sbi-win to claim.', 'Lottery / Smishing Trap', 98, 98, 'CRITICAL THREAT', '#EF4444', 'Do not click link or transfer funds. Block sender number.', 'Lottery Fraud', 'State Bank of India', 'http://bit.ly/sbi-win', '1 Day', 'No SSL (HTTP)', CURRENT_TIMESTAMP),

('scan_004', 'user_admin_001', 'Snayon Roy', 'qr', 'https://paytm-payment-security.xyz/collect?amt=5000', 'Fake Payment Gateway QR', 95, 90, 'CRITICAL THREAT', '#EF4444', 'Do not scan or approve UPI payment request. Fake gateway clone.', 'Quishing / QR Scam', 'Paytm QR', 'https://paytm-payment-security.xyz/collect', '2 Days', 'Untrusted CA', CURRENT_TIMESTAMP),

('scan_005', 'user_demo_002', 'demouser', 'voice', 'Audio Transcript: "Your Aadhaar is blocked by Telecom Dept. Share 6-digit OTP immediately to avoid police case."', 'Voice Vishing / OTP Fraud', 97, 96, 'CRITICAL THREAT', '#EF4444', 'Disconnect call immediately. Government agencies never ask OTP over phone.', 'Vishing Fraud', 'Government / Aadhaar', 'N/A', 'N/A', 'N/A', CURRENT_TIMESTAMP),

('scan_006', 'user_analyst_003', 'alex_cyber', 'screenshot', 'Image Payload: amazon_login_page_clone.png', 'Fake Brand Website Clone', 93, 89, 'HIGH RISK THREAT', '#EF4444', 'Screenshot shows stolen UI elements and non-standard domain URL.', 'Brand Impersonation', 'Amazon', 'http://amaz0n-checkout.top', '4 Days', 'Missing SSL', CURRENT_TIMESTAMP),

('scan_007', 'user_admin_001', 'Snayon Roy', 'domain', 'paypal-secure-login.xyz', 'Malicious Phishing Domain', 97, 94, 'CRITICAL THREAT', '#EF4444', 'Domain registered 4 days ago with privacy guard. High risk TLD .xyz', 'Typosquatting', 'PayPal', 'http://paypal-secure-login.xyz', '4 Days', 'Untrusted', CURRENT_TIMESTAMP),

('scan_008', 'user_demo_002', 'demouser', 'aichat', 'User Question: "I received a message saying my electricity will be cut tonight unless I pay via link. Is it real?"', 'Urgent Utility Scam', 95, 91, 'HIGH RISK THREAT', '#EF4444', 'This is a known utility payment scam. State electricity boards do not send bit.ly links.', 'Utility Payment Scam', 'Electricity Board', 'http://bit.ly/power-pay-now', '6 Days', 'No SSL', CURRENT_TIMESTAMP),

('scan_009', 'user_admin_001', 'Snayon Roy', 'url', 'https://github.com/cybershield-ai/security-core', 'Clean / Verified Website', 5, 99, 'SAFE / VERIFIED', '#10B981', 'URL is safe. EV SSL valid, high domain reputation.', 'None', 'GitHub', 'https://github.com', '16 Years', 'Valid (DigiCert)', CURRENT_TIMESTAMP),

('scan_010', 'user_demo_002', 'demouser', 'email', 'From: billing@tatapower.com | Subject: Your e-Bill Statement for July 2026', 'Legitimate Corporate Email', 12, 96, 'SAFE / VERIFIED', '#10B981', 'DKIM & SPF signatures valid. Recognized sender domain.', 'None', 'TATA Power', 'https://tatapower.com', '22 Years', 'Valid SSL', CURRENT_TIMESTAMP);

-- 4. Insert Explainable AI (XAI) Detection Reasons & Action Items
INSERT OR REPLACE INTO scan_reasons (scan_id, reason_text, is_action_item)
VALUES
('scan_001', 'Typosquatting domain mimicking official brand ("amaz0n" with number zero)', 0),
('scan_001', 'Newly registered domain (Age: 3 Days)', 0),
('scan_001', 'Invalid self-signed SSL security certificate', 0),
('scan_001', 'Action: Add domain to perimeter DNS blocklist', 1),
('scan_001', 'Action: Instruct user to reset account password if entered', 1),

('scan_002', 'Sender address spoofing attempt (paytm-securityverify.com != paytm.com)', 0),
('scan_002', 'Contains psychological pressure keywords ("Account Suspended", "Verify NOW")', 0),
('scan_002', 'Action: Quarantine email message in mail gateway', 1),

('scan_003', 'Lottery trap promising unrealistic reward (₹10,00,000)', 0),
('scan_003', 'Uses URL shortening service (bit.ly) to mask destination', 0),
('scan_003', 'Action: Report phone number to National Cyber Crime Portal (1930)', 1),

('scan_004', 'Decoded QR payload points to unverified payment collector endpoint', 0),
('scan_004', 'Dynamic URL redirection detected', 0),
('scan_004', 'Action: Cancel transaction immediately', 1);

-- 5. Insert Cyber Incident Reports
INSERT OR REPLACE INTO incidents (id, ticket_id, user_id, username, title, category, description, target_url_or_phone, loss_amount, status, severity, submitted_at)
VALUES
('inc_001', 'INC-2026-8891', 'user_demo_002', 'demouser', 'SBI Fake Banking SMS OTP Scam', 'Banking Fraud', 'Received SMS claiming account freeze. Clicked link and entered OTP resulting in unauthorized transaction.', '+91-9876543210', 45000.00, 'Under Investigation', 'High', CURRENT_TIMESTAMP),

('inc_002', 'INC-2026-7734', 'user_demo_002', 'demouser', 'Fake E-Commerce Clothing Website', 'Online Shopping Scam', 'Ordered goods from Instagram ad link. Payment debited but no order confirmation received.', 'https://trendy-fashion-sale.xyz', 12500.00, 'Resolved', 'Medium', CURRENT_TIMESTAMP),

('inc_003', 'INC-2026-9902', 'user_admin_001', 'Snayon Roy', 'Cryptocurrency Wallet Phishing Drain', 'Crypto Scam', 'Malicious DApp link drained USDT tokens from Web3 wallet via malicious approval signature.', 'https://uniswap-airdrop-claim.top', 250000.00, 'Open', 'Critical', CURRENT_TIMESTAMP);

-- 6. Insert Threat Intelligence Feeds
INSERT OR REPLACE INTO threat_intelligence_feeds (id, indicator, type, risk_level, source, description, last_updated)
VALUES
('feed_001', 'amaz0n-secure-login.xyz', 'Domain', 'Critical', 'CyberShield Global Threat Exchange', 'Active credential harvesting domain targeting Amazon accounts', CURRENT_TIMESTAMP),
('feed_002', 'paytm-securityverify.com', 'Domain', 'High', 'CERT-In Threat Feed', 'Phishing domain impersonating Indian digital payment gateway', CURRENT_TIMESTAMP),
('feed_003', '185.220.101.5', 'IP', 'High', 'Tor Exit Node Threat Registry', 'Known malicious Tor exit node used in automated brute force attacks', CURRENT_TIMESTAMP),
('feed_004', 'UPI_OTP_SUSPEND_TRAP', 'Keyword', 'High', 'CyberShield Heuristic Engine', 'Pattern signature matching voice vishing OTP coercion phrasing', CURRENT_TIMESTAMP);

-- 7. Insert System Audit Logs
INSERT OR REPLACE INTO audit_logs (id, actor_id, action, resource, details, created_at)
VALUES
('audit_001', 'user_admin_001', 'DATABASE_INITIALIZATION', 'Relational SQL Database', 'Schema DDL and enterprise seed datasets loaded successfully.', CURRENT_TIMESTAMP),
('audit_002', 'user_admin_001', 'SECURITY_POLICY_UPDATE', 'XAI Rule Engine', 'Updated risk score weightings for typosquatting .xyz TLDs.', CURRENT_TIMESTAMP);
