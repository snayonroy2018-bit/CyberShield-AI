/**
 * 🛡️ CyberShield AI - Relational SQL Database Service Engine
 * High-performance, zero-config embedded SQL database engine powered by SQLite3.
 * Supports async promises, transactions, parameterized prepared statements, schema DDL, and views.
 */

const fs = require('fs');
const path = require('path');
let sqlite3Module;
try {
  sqlite3Module = require('sqlite3');
} catch (e) {
  try {
    sqlite3Module = require(path.join(__dirname, '../server/node_modules/sqlite3'));
  } catch (e2) {
    sqlite3Module = require('sqlite3');
  }
}
const sqlite3 = sqlite3Module.verbose();

const DB_PATH = path.join(__dirname, 'cybershield.sqlite');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');
const SEED_PATH = path.join(__dirname, 'seed.sql');

let db = null;
let isInitialized = false;

/**
 * Get or initialize SQLite Database Instance
 */
function getDbInstance() {
  if (!db) {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Failed to open SQLite Database:', err.message);
      } else {
        console.log(`✅ SQLite Database connected successfully: ${DB_PATH}`);
        db.run('PRAGMA foreign_keys = ON;');
      }
    });
  }
  return db;
}

/**
 * Execute SQL Query returning multiple rows (SELECT)
 */
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    const database = getDbInstance();
    database.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

/**
 * Execute SQL Query returning a single row (SELECT)
 */
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    const database = getDbInstance();
    database.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

/**
 * Execute SQL Command (INSERT, UPDATE, DELETE, CREATE, DROP)
 */
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    const database = getDbInstance();
    database.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

/**
 * Execute raw SQL batch script containing multiple statements (DDL / Seeding)
 */
function execScript(sqlScript) {
  return new Promise((resolve, reject) => {
    const database = getDbInstance();
    database.exec(sqlScript, (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
}

/**
 * Initialize SQL Database Schema & Load Enterprise Seed Data
 */
async function initDb(forceReseed = false) {
  try {
    getDbInstance();

    // Read Schema DDL
    if (fs.existsSync(SCHEMA_PATH)) {
      const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
      await execScript(schemaSql);
      console.log('🏛️  SQL Schema DDL tables, indexes & analytical views executed.');
    }

    // Check if tables contain data or if force reseed requested
    const userCountRow = await get('SELECT COUNT(*) as cnt FROM users');
    const scanCountRow = await get('SELECT COUNT(*) as cnt FROM scans');

    if (forceReseed || !userCountRow || userCountRow.cnt === 0 || !scanCountRow || scanCountRow.cnt === 0) {
      if (fs.existsSync(SEED_PATH)) {
        const seedSql = fs.readFileSync(SEED_PATH, 'utf8');
        await execScript(seedSql);
        console.log('🌱 Enterprise Threat Seed Datasets loaded into SQL database.');
      }
    }

    isInitialized = true;
    return true;
  } catch (err) {
    console.error('❌ Error initializing SQL database:', err);
    return false;
  }
}

/**
 * Get Database Health & Summary Stats
 */
async function getStats() {
  try {
    const userCount = await get('SELECT COUNT(*) as count FROM users');
    const scanCount = await get('SELECT COUNT(*) as count FROM scans');
    const incidentCount = await get('SELECT COUNT(*) as count FROM incidents');
    const threatFeedCount = await get('SELECT COUNT(*) as count FROM threat_intelligence_feeds');
    const logCount = await get('SELECT COUNT(*) as count FROM user_logs');

    let fileSizeKB = 0;
    if (fs.existsSync(DB_PATH)) {
      const stats = fs.statSync(DB_PATH);
      fileSizeKB = (stats.size / 1024).toFixed(2);
    }

    return {
      status: 'Operational',
      engine: 'SQLite3 Relational Engine',
      dbPath: DB_PATH,
      fileSizeKB: `${fileSizeKB} KB`,
      counts: {
        users: userCount ? userCount.count : 0,
        scans: scanCount ? scanCount.count : 0,
        incidents: incidentCount ? incidentCount.count : 0,
        threatFeeds: threatFeedCount ? threatFeedCount.count : 0,
        userLogs: logCount ? logCount.count : 0
      }
    };
  } catch (err) {
    return { status: 'Error', error: err.message };
  }
}

module.exports = {
  getDbInstance,
  query,
  all: query,
  get,
  run,
  execScript,
  initDb,
  getStats,
  DB_PATH
};
