/**
 * 🛡️ CyberShield AI - SQL Database Management Utility CLI
 * Usage: node database/init_sql.js
 */

const path = require('path');
const sqlDb = require('./sqlDb');

async function runCli() {
  console.log('====================================================================');
  console.log('🛡️  CyberShield AI - SQL Database CLI Manager');
  console.log('====================================================================\n');

  console.log('🔄 Initializing Relational SQL Engine & Executing Schema DDL...');
  const success = await sqlDb.initDb(true);

  if (!success) {
    console.error('❌ Failed to initialize SQL database.');
    process.exit(1);
  }

  console.log('\n📊 Database Engine Health & Table Summary:');
  const stats = await sqlDb.getStats();
  console.log(JSON.stringify(stats, null, 2));

  console.log('\n🧪 Executing Diagnostic Analytical SQL Queries:\n');

  console.log('1️⃣ View: v_threat_analytics (Threat Metrics by Attack Vector):');
  const threatAnalytics = await sqlDb.query('SELECT * FROM v_threat_analytics');
  console.table(threatAnalytics);

  console.log('\n2️⃣ View: v_incident_sla_status (Cyber Incidents & Financial Loss):');
  const incidentAnalytics = await sqlDb.query('SELECT * FROM v_incident_sla_status');
  console.table(incidentAnalytics);

  console.log('\n3️⃣ View: v_user_security_profiles (User Security Scores & Login Activity):');
  const userProfiles = await sqlDb.query('SELECT * FROM v_user_security_profiles');
  console.table(userProfiles);

  console.log('\n====================================================================');
  console.log('✅ SQL Database initialization and diagnostic suite complete!');
  console.log('====================================================================\n');
  process.exit(0);
}

runCli();
