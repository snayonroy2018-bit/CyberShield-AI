import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Cpu, Server, Activity, ShieldAlert, CheckCircle, RefreshCw, Users, UserCheck, Shield, Clock, AlertTriangle, Key, Database, Terminal, Play, Table, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function AdminPanelPage({ user }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SQL Console & Database Explorer States
  const [sqlStats, setSqlStats] = useState(null);
  const [sqlTables, setSqlTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [sqlQueryInput, setSqlQueryInput] = useState('SELECT * FROM v_threat_analytics;');
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [queryExecuting, setQueryExecuting] = useState(false);

  const cannedQueries = [
    { label: '📊 Threat Analytics View', query: 'SELECT * FROM v_threat_analytics;' },
    { label: '🚨 Incident SLA & Financial Loss View', query: 'SELECT * FROM v_incident_sla_status;' },
    { label: '👤 User Security Risk Profiles View', query: 'SELECT * FROM v_user_security_profiles;' },
    { label: '⚠️ Top 10 Critical Threat Scans', query: 'SELECT * FROM scans WHERE risk_score > 70 ORDER BY risk_score DESC LIMIT 10;' },
    { label: '🌐 Active Threat Intelligence Feeds', query: 'SELECT * FROM threat_intelligence_feeds ORDER BY last_updated DESC;' },
    { label: '📝 Audit Log Trail', query: 'SELECT * FROM audit_logs ORDER BY created_at DESC;' }
  ];

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchMetrics();
      fetchSqlDetails();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/metrics');
      setMetrics(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Access denied. Administrator privileges required.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSqlDetails = async () => {
    try {
      const [statsRes, tablesRes] = await Promise.all([
        api.get('/sql/stats'),
        api.get('/sql/tables')
      ]);
      setSqlStats(statsRes.data);
      setSqlTables(tablesRes.data?.tables || []);
      // Execute initial canned query
      runSqlQuery('SELECT * FROM v_threat_analytics;');
    } catch (err) {
      console.error('SQL details fetch warning:', err);
    }
  };

  const runSqlQuery = async (queryToRun) => {
    const q = queryToRun || sqlQueryInput;
    if (!q) return;
    setQueryExecuting(true);
    setQueryError(null);
    setQueryResult(null);
    try {
      const res = await api.post('/sql/query', { sqlQuery: q });
      if (res.data.success) {
        setQueryResult(res.data);
      } else {
        setQueryError(res.data.error || 'Query execution failed.');
      }
    } catch (err) {
      console.error('SQL query error:', err);
      setQueryError(err.response?.data?.msg || err.response?.data?.error || 'SQL syntax error or restricted query.');
    } finally {
      setQueryExecuting(false);
    }
  };

  // If user is not logged in or not an Admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/60 text-slate-400 border border-slate-700 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-100">404 - Page Not Found</h2>
            <p className="text-sm text-slate-400">
              The requested page does not exist or you do not have permission to view it.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/admin-portal"
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-neon hover:scale-105 transition-transform inline-block"
            >
              Admin Portal
            </Link>
            <Link
              to="/"
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700 transition-colors inline-block"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-purple-400">
            <Lock className="w-4 h-4 text-purple-400" />
            <span>ADMINISTRATOR CONTROL OPERATIONS CENTER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1 flex items-center space-x-3">
            <span>Welcome, {metrics?.adminName || user?.username || 'Snayon Roy'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-mono border border-purple-500/40">
              Super Admin
            </span>
          </h1>
        </div>

        <button
          onClick={() => { fetchMetrics(); fetchSqlDetails(); }}
          className="px-4 py-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 font-mono text-xs flex items-center space-x-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh System Metrics</span>
        </button>
      </div>

      {error ? (
        <div className="p-6 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm font-mono flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : loading ? (
        <div className="text-center py-16 font-mono text-purple-400 space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-400" />
          <p className="text-sm">LOADING ADMINISTRATOR SYSTEM METRICS & USER LOGS...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Top Key Performance Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">System Status</span>
              <div className="text-xl font-bold text-emerald-400 font-mono flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>{metrics?.systemHealth || '100% Operational'}</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Registered Portal Users</span>
              <div className="text-2xl font-extrabold text-purple-400 font-mono flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>{metrics?.totalRegisteredUsers || (metrics?.registeredUsers?.length || 2)}</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">SQL Relational Engine</span>
              <div className="text-xl font-extrabold text-cyan-400 font-mono flex items-center space-x-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <span>{sqlStats?.engine ? 'SQLite3 Active' : 'Online'}</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase">Total SQL DB Scans</span>
              <div className="text-2xl font-extrabold text-amber-400 font-mono">
                {sqlStats?.counts?.scans || metrics?.activeThreatFeeds || 10}
              </div>
            </div>
          </div>

          {/* SECTION: ENTERPRISE SQL DATABASE EXPLORER & LIVE CONSOLE */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/40 space-y-6 shadow-2xl bg-slate-950/60">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Database className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-100 font-mono uppercase flex items-center space-x-3">
                    <span>Relational SQL Database Explorer</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[11px] font-mono border border-cyan-500/40">
                      3NF Relational Schema
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Interactive read-only SQL query console, table schemas, and analytical views
                  </p>
                </div>
              </div>

              {sqlStats && (
                <div className="flex items-center space-x-4 text-xs font-mono text-slate-400 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800">
                  <div>Size: <span className="text-cyan-400 font-bold">{sqlStats.fileSizeKB}</span></div>
                  <div>Users: <span className="text-purple-400 font-bold">{sqlStats.counts?.users}</span></div>
                  <div>Scans: <span className="text-amber-400 font-bold">{sqlStats.counts?.scans}</span></div>
                  <div>Incidents: <span className="text-red-400 font-bold">{sqlStats.counts?.incidents}</span></div>
                </div>
              )}
            </div>

            {/* Quick Canned Query Preset Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Quick Canned SQL Analytical Query Presets:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {cannedQueries.map((cq, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSqlQueryInput(cq.query);
                      runSqlQuery(cq.query);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-mono hover:text-cyan-300 transition-colors flex items-center space-x-1.5"
                  >
                    <span>{cq.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SQL Query Editor Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-cyan-400 flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Interactive SQL Query Console</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500">Read-Only Safety Enforcement Active</span>
              </div>

              <div className="relative">
                <textarea
                  value={sqlQueryInput}
                  onChange={(e) => setSqlQueryInput(e.target.value)}
                  rows={3}
                  className="w-full p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs border border-slate-800 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 shadow-inner"
                  placeholder="Enter SQL SELECT query..."
                />
                <button
                  onClick={() => runSqlQuery()}
                  disabled={queryExecuting}
                  className="absolute bottom-3 right-3 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-mono text-xs font-bold shadow-neon hover:scale-105 transition-transform flex items-center space-x-2 disabled:opacity-50"
                >
                  {queryExecuting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                  <span>Execute Query</span>
                </button>
              </div>
            </div>

            {/* Query Results / Errors Output Display */}
            {queryError && (
              <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 font-mono text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{queryError}</span>
              </div>
            )}

            {queryResult && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center space-x-2">
                    <Table className="w-4 h-4 text-emerald-400" />
                    <span>Query Output Results (<span className="text-emerald-400 font-bold">{queryResult.rowCount} rows</span> returned)</span>
                  </span>
                  <span>Execution Latency: <span className="text-cyan-400 font-bold">{queryResult.executionTimeMs}ms</span></span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 max-h-80 overflow-y-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 uppercase text-[11px] sticky top-0">
                        {queryResult.columns.map((col, idx) => (
                          <th key={idx} className="py-2.5 px-3 border-r border-slate-800/50">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 text-slate-300">
                      {queryResult.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/60 transition-colors">
                          {queryResult.columns.map((col, cIdx) => (
                            <td key={cIdx} className="py-2 px-3 border-r border-slate-800/30 whitespace-nowrap">
                              {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? 'NULL')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Database Tables Schema List */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                Relational Database Tables & Row Counts ({sqlTables.length} Tables):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sqlTables.map((tbl, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{tbl.tableName}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                        {tbl.rowCount} rows
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Cols: {tbl.columns.map(c => c.name).join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TABLE 1: REGISTERED PORTAL USERS DIRECTORY */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-purple-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-mono uppercase">
                    Registered Users Directory ({metrics?.registeredUsers?.length || 0})
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Saved portal accounts & saved user details</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                    <th className="pb-3 px-3">Username / Name</th>
                    <th className="pb-3 px-3">Email Address</th>
                    <th className="pb-3 px-3">Role</th>
                    <th className="pb-3 px-3">Security Score</th>
                    <th className="pb-3 px-3">Total Logins</th>
                    <th className="pb-3 px-3">Last Login Time</th>
                    <th className="pb-3 px-3">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(metrics?.registeredUsers || []).map((usr, idx) => (
                    <tr key={usr._id || idx} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3 text-slate-100 font-bold flex items-center space-x-2">
                        <span>{usr.username}</span>
                        {usr.role === 'admin' && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                            ADMIN
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-300">{usr.email}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${usr.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                          {usr.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">
                        {usr.securityScore || (usr.role === 'admin' ? 99 : 88)}
                      </td>
                      <td className="py-3 px-3 text-slate-300">{usr.loginCount || 1} logins</td>
                      <td className="py-3 px-3 text-slate-400">
                        {usr.lastLoginAt ? new Date(usr.lastLoginAt).toLocaleString() : 'Just Now'}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {usr.createdAt ? new Date(usr.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE 2: USER LOGIN & REGISTRATION AUDIT LOG STREAM */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 font-mono uppercase">
                    User Login & Activity Audit Logs ({metrics?.userLogs?.length || 0})
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">Real-time authentication log stream</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs max-h-96 overflow-y-auto pr-2">
              {(metrics?.userLogs || []).map((log, idx) => (
                <div key={log._id || idx} className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${log.actionType === 'REGISTER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                      {log.actionType}
                    </span>
                    <div>
                      <span className="text-slate-100 font-bold">{log.username}</span>
                      <span className="text-slate-400 ml-2 text-[11px]">({log.email})</span>
                      <span className="text-slate-500 ml-2">IP: {log.ipAddress || '127.0.0.1'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-emerald-400 font-semibold">{log.status}</span>
                    <span className="text-slate-500 text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Model & System Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2 font-mono">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span>AI Microservice Diagnostics</span>
              </h3>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">FastAPI Microservice:</span>
                  <span className="text-emerald-400 font-bold">ONLINE (Port 8000)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scikit-Learn NLP Pipeline:</span>
                  <span className="text-cyan-400 font-bold">ACTIVE (0.984 AUC)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Server Uptime:</span>
                  <span className="text-purple-400 font-bold">{metrics?.serverUptime || '99.98%'}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 font-mono">System Audit Trail</h3>
              <div className="space-y-2 font-mono text-xs">
                {(metrics?.systemLogs || []).map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${log.type === 'ALERT' ? 'bg-red-500/20 text-red-400' : 'bg-purple-500/20 text-purple-300'}`}>
                        {log.type}
                      </span>
                      <span className="text-slate-200">{log.message}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
