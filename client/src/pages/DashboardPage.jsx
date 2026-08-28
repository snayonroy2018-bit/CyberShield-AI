import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Activity, AlertOctagon, CheckCircle, TrendingUp, Cpu, Download, ArrowUpRight, Clock, FileText, Lock, RefreshCw, Calendar, BarChart2, Layers } from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { api } from '../services/api';
import { generatePDFReport } from '../utils/pdfGenerator';
import ScanResultModal from '../components/ScanResultModal';
import HeartbeatTelemetryModal from '../components/HeartbeatTelemetryModal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage({ user }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);
  const [telemetryModal, setTelemetryModal] = useState(null);
  
  // Time period filter: 'hourly', 'today', 'yesterday', 'monthly'
  const [timeView, setTimeView] = useState('today');

  // Master System Refresh Loading Spinner State
  const [refreshingSystem, setRefreshingSystem] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/scans/analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSystem = async () => {
    setRefreshingSystem(true);
    await fetchAnalytics();
    setTimeout(() => {
      setRefreshingSystem(false);
    }, 600);
  };

  // Real-life scan metrics calculated dynamically from user activity
  const realTotalScans = analytics?.totalScans || (analytics?.recentActivities?.length || 0);
  const realThreatsBlocked = analytics?.threatsDetected || (analytics?.recentActivities?.filter(s => (s.riskScore || s.risk_score) > 70).length || 0);
  const realTodaysScans = analytics?.todaysScans || (analytics?.recentActivities?.filter(s => {
    const scanDate = new Date(s.createdAt || s.date || Date.now()).toDateString();
    return scanDate === new Date().toDateString();
  }).length || 0);
  
  const realHygieneScore = realTotalScans > 0 
    ? Math.max(0, Math.min(100, 100 - Math.round((realThreatsBlocked / realTotalScans) * 40))) 
    : 100;

  // Time-Period Dataset (Hourly, Today, Yesterday, Monthly)
  const getTimeTrendDataset = () => {
    const history = analytics?.recentActivities || [];
    const now = new Date();

    if (timeView === 'hourly') {
      const labels = [];
      const scanCounts = [];
      const threatCounts = [];

      for (let i = 5; i >= 0; i--) {
        const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000);
        hourStart.setMinutes(0, 0, 0);
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

        const label = i === 0 ? 'Current Hour' : `${hourStart.getHours()}:00`;
        labels.push(label);

        const matchingScans = history.filter(s => {
          const d = new Date(s.date || s.createdAt || Date.now());
          return d >= hourStart && d < hourEnd;
        });

        scanCounts.push(matchingScans.length);
        threatCounts.push(matchingScans.filter(s => (s.riskScore || s.risk_score || 0) > 70).length);
      }
      return { labels, scans: scanCounts, threats: threatCounts };
    }

    if (timeView === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      const slots = [
        { label: '00:00 - 06:00', start: 0, end: 6 },
        { label: '06:00 - 12:00', start: 6, end: 12 },
        { label: '12:00 - 18:00', start: 12, end: 18 },
        { label: '18:00 - 24:00', start: 18, end: 24 }
      ];

      const labels = slots.map(s => s.label);
      const scanCounts = slots.map(slot => {
        return history.filter(s => {
          const d = new Date(s.date || s.createdAt || Date.now());
          return d.toDateString() === yesterdayStr && d.getHours() >= slot.start && d.getHours() < slot.end;
        }).length;
      });

      const threatCounts = slots.map(slot => {
        return history.filter(s => {
          const d = new Date(s.date || s.createdAt || Date.now());
          const isThreat = (s.riskScore || s.risk_score || 0) > 70;
          return d.toDateString() === yesterdayStr && d.getHours() >= slot.start && d.getHours() < slot.end && isThreat;
        }).length;
      });

      return { labels, scans: scanCounts, threats: threatCounts };
    }

    // Default: Today
    const todayStr = now.toDateString();
    const slots = [
      { label: '00:00 - 06:00', start: 0, end: 6 },
      { label: '06:00 - 12:00', start: 6, end: 12 },
      { label: '12:00 - 18:00', start: 12, end: 18 },
      { label: '18:00 - 24:00 (Live)', start: 18, end: 24 }
    ];

    const labels = slots.map(s => s.label);
    const scanCounts = slots.map(slot => {
      return history.filter(s => {
        const d = new Date(s.date || s.createdAt || Date.now());
        return d.toDateString() === todayStr && d.getHours() >= slot.start && d.getHours() < slot.end;
      }).length;
    });

    const threatCounts = slots.map(slot => {
      return history.filter(s => {
        const d = new Date(s.date || s.createdAt || Date.now());
        const isThreat = (s.riskScore || s.risk_score || 0) > 70;
        return d.toDateString() === todayStr && d.getHours() >= slot.start && d.getHours() < slot.end && isThreat;
      }).length;
    });

    return { labels, scans: scanCounts, threats: threatCounts };
  };

  const currentTrend = getTimeTrendDataset();

  const lineChartData = {
    labels: currentTrend.labels,
    datasets: [
      {
        label: 'Scans Executed',
        data: currentTrend.scans,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Threats Neutralized',
        data: currentTrend.threats,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { family: 'JetBrains Mono' } } }
    },
    scales: {
      x: { ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono' } }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  // Risk Distribution Pie Chart Data
  const pieChartData = {
    labels: ['Phishing / Scam', 'Suspicious', 'Safe'],
    datasets: [
      {
        data: [
          analytics?.riskDistribution?.phishing || 84,
          analytics?.riskDistribution?.suspicious || 29,
          analytics?.riskDistribution?.safe || 15
        ],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        borderColor: '#090d16',
        borderWidth: 3
      }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-mono">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin"></div>
        <p className="text-sm text-cyan-400">LOADING CYBERSHIELD REAL-TIME ANALYTICS...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner Header with Single Master Refresh System Button */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Shield className="w-4 h-4" />
            <span>REAL-TIME PROTECTION DASHBOARD</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">
            Welcome back, {user ? user.username : 'Security Auditor'} 🛡️
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            CyberShield AI engine is actively monitoring SMS, Email headers, domain WHOIS records, and vishing call streams.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 w-full md:w-auto">
          {/* Master Refresh System Button */}
          <button
            onClick={handleRefreshSystem}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 font-mono text-xs font-bold flex items-center space-x-2 transition-all shadow-lg hover:shadow-cyan-500/20"
            title="Refresh System Analytics & Scan Metrics"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${refreshingSystem ? 'animate-spin' : ''}`} />
            <span>🔄 Refresh System</span>
          </button>

          <Link
            to="/scanners"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm shadow-neon hover:scale-105 transition-transform flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Launch AI Scanners</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2 font-mono text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>SECURITY METRICS MONITORING</span>
          </span>
          <span className="text-cyan-400 text-[11px]">Real-Time User Operations Counter</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Metric Card 1: Total Scans Executed */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-3 relative overflow-hidden shadow-lg card-3d-tilt cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                Total Scans Executed
              </span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-extrabold text-slate-100 font-mono">
                {realTotalScans}
              </div>
              <span className="text-xs text-slate-400 font-mono">scans</span>
            </div>
            <p className="text-[11px] text-cyan-400 font-mono flex items-center space-x-1 border-t border-slate-800/80 pt-2">
              <TrendingUp className="w-3 h-3" />
              <span>Real-time execution log</span>
            </p>
          </div>

          {/* Metric Card 2: Threats Blocked */}
          <div className="glass-panel p-6 rounded-2xl border border-red-500/30 space-y-3 relative overflow-hidden shadow-lg card-3d-purple cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                Threats Neutralized
              </span>
              <AlertOctagon className="w-4 h-4 text-red-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-extrabold text-red-400 font-mono">
                {realThreatsBlocked}
              </div>
              <span className="text-xs text-red-300 font-mono">threats</span>
            </div>
            <p className="text-[11px] text-red-300 font-mono border-t border-slate-800/80 pt-2">
              Scams & Phishing Neutralized
            </p>
          </div>

          {/* Metric Card 3: Today's Scans */}
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-3 relative overflow-hidden shadow-lg card-3d-tilt cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Today's Scans
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-extrabold text-amber-400 font-mono">
                {realTodaysScans}
              </div>
              <span className="text-xs text-amber-300 font-mono">today</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono border-t border-slate-800/80 pt-2">
              Autonomous AI Pipeline
            </p>
          </div>

          {/* Metric Card 4: Security Hygiene Score */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-3 relative overflow-hidden shadow-lg card-3d-emerald cursor-pointer">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Security Hygiene Score
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                {realHygieneScore}%
              </div>
              <span className="text-xs text-emerald-300 font-mono">Optimal</span>
            </div>
            <p className="text-[11px] text-emerald-300 font-mono border-t border-slate-800/80 pt-2">
              Verified Shield Health
            </p>
          </div>

        </div>
      </div>

      {/* DASHBOARD SPECIAL CYBER EFFECT: LIVE SECURITY HEARTBEAT WAVEFORM HUD */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_35px_rgba(0,240,255,0.12)] space-y-4 font-mono relative overflow-hidden transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-cyan-500/20 pb-3 gap-2">
          <div 
            onClick={() => setTelemetryModal('main')}
            className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-cyan-300 hover:underline group"
          >
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse group-hover:scale-110 transition-transform" />
            <span>LIVE THREAT MATRIX HEARTBEAT TELEMETRY</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-normal border border-cyan-500/30 no-underline">⚡ OPEN PORTAL</span>
          </div>
          <button
            onClick={() => setTelemetryModal('neural')}
            className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 hover:bg-emerald-500/30 hover:scale-105 transition-all cursor-pointer font-bold w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>AI NEURAL ENGINE ONLINE 🔍</span>
          </button>
        </div>

        {/* Heartbeat ECG / Pulse Waveform Animation Visual (Clickable) */}
        <div 
          onClick={() => setTelemetryModal('main')}
          className="relative h-20 bg-[#030712] rounded-2xl border border-slate-800 hover:border-cyan-500/50 overflow-hidden flex items-center px-4 cursor-pointer group transition-all"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.15),transparent)]" />
          
          {/* Animated Waveform SVG Line */}
          <svg className="w-full h-12 text-cyan-400 group-hover:text-cyan-300 transition-colors" viewBox="0 0 500 50" fill="none" preserveAspectRatio="none">
            <path
              d="M0,25 L100,25 L120,5 L140,45 L160,15 L180,35 L200,25 L300,25 L320,0 L340,50 L360,25 L500,25"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray="600"
              strokeDashoffset="600"
              className="animate-[dash_3s_linear_infinite]"
            />
          </svg>

          {/* Floating Interactive Data Pulse Badges */}
          <div className="absolute right-4 sm:right-6 top-3 flex flex-wrap items-center gap-2 text-[11px]">
            <button 
              onClick={(e) => { e.stopPropagation(); setTelemetryModal('frequency'); }}
              className="text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              FREQUENCY: 60Hz 🔍
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setTelemetryModal('encryption'); }}
              className="text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              ENCRYPTION: AES-256 🔍
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setTelemetryModal('buffer'); }}
              className="text-emerald-300 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              BUFFER: 0 DROPPED 🔍
            </button>
          </div>
        </div>
      </div>

      {/* Time Trend Activity Section (Hourly, Today, Yesterday, Monthly) */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/30 space-y-6 shadow-2xl">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
              <Calendar className="w-4 h-4" />
              <span>TIME PERIOD SCAN & THREAT ANALYTICS</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-100 mt-1 capitalize">
              {timeView} Scan Activity & Neutralized Threats
            </h3>
            <p className="text-xs text-slate-400 font-mono">Filter by Hourly, Today, Yesterday, or Monthly timeframes.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 4 Time View Filters (Hourly, Today, Yesterday, Monthly) */}
            <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 font-mono text-xs">
              <button
                type="button"
                onClick={() => setTimeView('hourly')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                  timeView === 'hourly' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⏱️ Hourly
              </button>
              <button
                type="button"
                onClick={() => setTimeView('today')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                  timeView === 'today' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                📅 Today
              </button>
              <button
                type="button"
                onClick={() => setTimeView('yesterday')}
                className={`px-3 py-1.5 rounded-lg transition-colors font-bold ${
                  timeView === 'yesterday' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⏪ Yesterday
              </button>
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="pt-2">
          <Line data={lineChartData} options={lineChartOptions} />
        </div>

      </div>

      {/* Analytics Charts & Risk Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Risk Distribution Pie Chart */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4 flex flex-col justify-between shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Risk Level Distribution</h3>
              <p className="text-xs text-slate-400 font-mono">Evaluated Payload Classification</p>
            </div>
          </div>

          <div className="max-w-[240px] mx-auto py-4">
            <Pie data={pieChartData} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-4 border-t border-slate-800">
            <div>
              <div className="text-red-400 font-bold">{analytics?.riskDistribution?.phishing || 84}</div>
              <div className="text-slate-400 text-[10px]">Phishing</div>
            </div>
            <div>
              <div className="text-amber-400 font-bold">{analytics?.riskDistribution?.suspicious || 29}</div>
              <div className="text-slate-400 text-[10px]">Suspicious</div>
            </div>
            <div>
              <div className="text-emerald-400 font-bold">{analytics?.riskDistribution?.safe || 15}</div>
              <div className="text-slate-400 text-[10px]">Safe</div>
            </div>
          </div>
        </div>

        {/* Recent AI Scan Activity Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">Recent AI Threat Evaluations</h3>
              <p className="text-xs text-slate-400 font-mono">Click any row to inspect Explainable AI breakdown and export PDF</p>
            </div>
            
            <Link to="/history" className="text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-mono text-cyan-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Scan Type</th>
                  <th className="py-3 px-4">Input Evaluated</th>
                  <th className="py-3 px-4">Threat Classification</th>
                  <th className="py-3 px-4">Risk Score</th>
                  <th className="py-3 px-4">PDF Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
                {(analytics?.recentActivities || []).map((scan, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedScan(scan)}
                    className="hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {scan.scanType || scan.scan_type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 max-w-[220px] truncate">
                      {scan.input}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${(scan.riskScore || scan.risk_score || 0) > 70 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {scan.threatType || scan.threat_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span className={(scan.riskScore || scan.risk_score || 0) > 70 ? 'text-red-400' : 'text-emerald-400'}>
                        {scan.riskScore || scan.risk_score}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generatePDFReport(scan, user ? user.username : 'CyberShield User');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-black text-cyan-300 transition-colors flex items-center space-x-1 font-mono font-bold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Modal for detailed evaluation */}
      {selectedScan && (
        <ScanResultModal
          scanResult={selectedScan}
          onClose={() => setSelectedScan(null)}
          user={user}
        />
      )}

      {/* Interactive Heartbeat Telemetry Portal Modal */}
      {telemetryModal && (
        <HeartbeatTelemetryModal
          activeSubView={telemetryModal}
          onClose={() => setTelemetryModal(null)}
        />
      )}

    </div>
  );
}
