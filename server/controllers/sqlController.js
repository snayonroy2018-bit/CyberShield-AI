/**
 * 🛡️ CyberShield AI - SQL Database Controller & Analytics API
 * Handles database table inspection, interactive SQL console execution, and analytical views.
 */

const sqlDb = require('../../database/sqlDb');

/**
 * Get SQL Database Engine Stats and Table Summary
 */
exports.getSqlStats = async (req, res) => {
  try {
    const stats = await sqlDb.getStats();
    res.json(stats);
  } catch (err) {
    console.error('SQL Stats Error:', err);
    res.status(500).json({ msg: 'Failed to retrieve SQL database statistics.' });
  }
};

/**
 * Get Database Tables & Schemas
 */
exports.getSqlTables = async (req, res) => {
  try {
    const tables = await sqlDb.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
    );
    const views = await sqlDb.query(
      "SELECT name FROM sqlite_master WHERE type='view' ORDER BY name;"
    );

    const tableDetails = [];
    for (const t of tables) {
      const rowCountRes = await sqlDb.get(`SELECT COUNT(*) as count FROM ${t.name}`);
      const columns = await sqlDb.query(`PRAGMA table_info(${t.name})`);
      tableDetails.push({
        tableName: t.name,
        rowCount: rowCountRes ? rowCountRes.count : 0,
        columns: columns.map(c => ({
          name: c.name,
          type: c.type,
          primaryKey: c.pk === 1,
          notNull: c.notnull === 1,
          defaultValue: c.dflt_value
        }))
      });
    }

    res.json({
      engine: 'SQLite3 Relational Database',
      dbPath: sqlDb.DB_PATH,
      tableCount: tableDetails.length,
      tables: tableDetails,
      views: views.map(v => v.name)
    });
  } catch (err) {
    console.error('SQL Tables Error:', err);
    res.status(500).json({ msg: 'Failed to retrieve database schema details.' });
  }
};

/**
 * Interactive SQL Query Console Endpoint (Protected Read-Only Console)
 */
exports.executeSqlQuery = async (req, res) => {
  try {
    const { sqlQuery } = req.body;
    if (!sqlQuery || typeof sqlQuery !== 'string') {
      return res.status(400).json({ msg: 'A valid SQL query string is required.' });
    }

    const trimmed = sqlQuery.trim();
    const upper = trimmed.toUpperCase();

    // Security Gatekeeper: Strictly enforce read-only analytical SQL queries
    if (
      !upper.startsWith('SELECT') &&
      !upper.startsWith('EXPLAIN') &&
      !upper.startsWith('PRAGMA') &&
      !upper.startsWith('WITH')
    ) {
      return res.status(400).json({
        msg: 'Security Restriction: Web SQL Console only permits read-only analytical queries (SELECT, WITH, EXPLAIN, PRAGMA).'
      });
    }

    const startTime = Date.now();
    const rows = await sqlDb.query(trimmed);
    const executionTimeMs = Date.now() - startTime;

    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    res.json({
      success: true,
      queryExecuted: trimmed,
      rowCount: rows.length,
      columns,
      rows,
      executionTimeMs
    });
  } catch (err) {
    console.error('SQL Execution Error:', err.message);
    res.status(400).json({
      success: false,
      error: err.message || 'SQL Execution Syntax Error'
    });
  }
};

/**
 * Get SQL Analytical View Datasets
 */
exports.getSqlAnalytics = async (req, res) => {
  try {
    const threatAnalytics = await sqlDb.query('SELECT * FROM v_threat_analytics');
    const incidentSla = await sqlDb.query('SELECT * FROM v_incident_sla_status');
    const userProfiles = await sqlDb.query('SELECT * FROM v_user_security_profiles');
    const threatFeeds = await sqlDb.query('SELECT * FROM threat_intelligence_feeds ORDER BY last_updated DESC LIMIT 10');
    const recentScans = await sqlDb.query('SELECT * FROM scans ORDER BY created_at DESC LIMIT 10');

    res.json({
      threatAnalytics,
      incidentSla,
      userProfiles,
      threatFeeds,
      recentScans
    });
  } catch (err) {
    console.error('SQL Analytics Error:', err);
    res.status(500).json({ msg: 'Failed to execute analytical views.' });
  }
};
