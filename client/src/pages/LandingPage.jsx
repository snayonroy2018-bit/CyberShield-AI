import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Zap, Lock, Search, Cpu, BarChart3, AlertOctagon, CheckCircle2, ChevronRight, MessageSquare, PhoneCall, QrCode, Mail, FileText, ArrowRight, UserCheck, HelpCircle, User, AlertCircle, Eye, EyeOff, Terminal, Activity, Radio, Database, Box } from 'lucide-react';
import { api } from '../services/api';
import Cyber3DVisualizer from '../components/Cyber3DVisualizer';
import CyberMatrixModals from '../components/CyberMatrixModals';
import HeartbeatTelemetryModal from '../components/HeartbeatTelemetryModal';
import AIScannerPropertyModal from '../components/AIScannerPropertyModal';

export default function LandingPage({ user, onLoginSuccess }) {
  const [quickInput, setQuickInput] = useState('');
  const [matrixModal, setMatrixModal] = useState(null); // 'projection' | 'beacons' | 'tilt' | null
  const [telemetryModalView, setTelemetryModalView] = useState(null); // 'main' | 'packets' | 'threats' | 'latency' | 'encryption' | null
  const [selectedPropertyModal, setSelectedPropertyModal] = useState(null);
  const [authMode, setAuthMode] = useState('register'); // 'register', 'login', or 'admin'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [infoMsg, setInfoMsg] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  // Interactive Cyber Terminal State
  const [cmdInput, setCmdInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'sys', text: 'CYBERSHIELD AI KERNEL v2.4 INITIALIZED' },
    { type: 'sys', text: 'PORT 443 SECURE • RADAR SCANNER ONLINE' },
    { type: 'sys', text: 'Type "help" or click command pills below to navigate system pages.' }
  ]);

  const handleTerminalSubmit = (e, customCmd) => {
    if (e) e.preventDefault();
    const rawCmd = customCmd !== undefined ? customCmd : cmdInput;
    if (!rawCmd.trim()) return;
    const input = rawCmd.trim().toLowerCase();
    const newLogs = [...terminalLogs, { type: 'user', text: `$ ${rawCmd}` }];

    if (input === 'help') {
      newLogs.push(
        { type: 'res', text: 'Available Cyber Diagnostic & Page Commands:' },
        { type: 'res', text: '  scan / scanners - Launch zero-day AI threat scanner suite' },
        { type: 'res', text: '  status / dash  - Open live microservice & packet telemetry' },
        { type: 'res', text: '  threats / log  - Inspect recently blocked phishing IPs' },
        { type: 'res', text: '  report         - Open Cyber Helpline Incident Portal (1930)' },
        { type: 'res', text: '  learning       - Open Cybersecurity Knowledge Hub' },
        { type: 'res', text: '  admin          - Access Administrator Portal' },
        { type: 'res', text: '  clear          - Clear terminal screen' }
      );
    } else if (input === 'scan' || input === 'scanners') {
      newLogs.push(
        { type: 'res', text: '[AI SCAN] Sweeping ports & zero-day URL signatures...' },
        { type: 'res', text: '⚡ REDIRECTING TO AI SCANNER MODULES PAGE...' }
      );
      setTimeout(() => {
        navigate(user ? '/scanners' : '/login', { state: { prefillType: 'url', prefillInput: 'https://amaz0n-secure-login.xyz' } });
      }, 600);
    } else if (input === 'status' || input === 'dash' || input === 'dashboard') {
      newLogs.push(
        { type: 'res', text: 'Status: 100% OPERATIONAL • Express:5000 | FastAPI:8000' },
        { type: 'res', text: '⚡ OPENING LIVE SYSTEM TELEMETRY...' }
      );
      setTimeout(() => {
        setTelemetryModalView('main');
      }, 400);
    } else if (input === 'threats' || input === 'log' || input === 'history') {
      newLogs.push(
        { type: 'res', text: 'Blocked 185.220.101.5 (Typosquatting) • Blocked 103.14.26.11 (Voice Spoof)' },
        { type: 'res', text: '⚡ NAVIGATING TO THREAT AUDIT HISTORY PAGE...' }
      );
      setTimeout(() => {
        navigate(user ? '/history' : '/login');
      }, 600);
    } else if (input === 'report' || input === 'incident') {
      newLogs.push(
        { type: 'res', text: '[INCIDENT PORTAL] Syncing with Cyber Helpline 1930...' },
        { type: 'res', text: '⚡ OPENING INCIDENT REPORT PAGE...' }
      );
      setTimeout(() => {
        navigate(user ? '/report-incident' : '/login');
      }, 600);
    } else if (input === 'learning' || input === 'hub') {
      newLogs.push(
        { type: 'res', text: '[LEARNING HUB] Fetching cybersecurity modules...' },
        { type: 'res', text: '⚡ OPENING LEARNING HUB PAGE...' }
      );
      setTimeout(() => {
        navigate(user ? '/learning-hub' : '/login');
      }, 600);
    } else if (input === 'admin') {
      newLogs.push(
        { type: 'res', text: '[ADMIN PORTAL] Checking administrator credentials...' },
        { type: 'res', text: '⚡ REDIRECTING TO ADMIN PORTAL...' }
      );
      setTimeout(() => {
        navigate(user?.role === 'admin' ? '/admin' : '/admin-portal');
      }, 600);
    } else if (input === 'clear') {
      setTerminalLogs([]);
      setCmdInput('');
      return;
    } else {
      newLogs.push({ type: 'err', text: `Command not recognized: "${rawCmd}". Type "help" or click options below.` });
    }

    setTerminalLogs(newLogs);
    setCmdInput('');
  };

  const handleQuickScan = (e) => {
    e.preventDefault();
    if (quickInput.trim()) {
      navigate('/scanners', { state: { prefillInput: quickInput, prefillType: 'url' } });
    } else {
      navigate('/scanners');
    }
  };

  const handleFrontPageAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      if (authMode === 'register') {
        const res = await api.post('/auth/register', { username, email, password });
        if (res.data.success) {
          setAuthMode('login');
          setInfoMsg('Account created successfully! Now please Sign In to enter the site.');
        }
      } else {
        const res = await api.post('/auth/login', { emailOrUsername: username, password });
        if (res.data.token && res.data.user) {
          if (authMode === 'admin' && res.data.user.role !== 'admin') {
            setAuthError('Access denied. Administrator privileges required (snayonroy2018@gmail.com).');
            setAuthLoading(false);
            return;
          }
          localStorage.setItem('cybershield_token', res.data.token);
          if (onLoginSuccess) {
            onLoginSuccess(res.data.user);
          }
          if (res.data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }
      }
    } catch (err) {
      setAuthError(err.response?.data?.msg || `${authMode === 'register' ? 'Registration' : 'Login'} failed.`);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-8 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-mono shadow-neon">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-POWERED PHISHING & SCAM FRAUD DETECTION SYSTEM</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 max-w-5xl mx-auto leading-tight">
            Stop Cyber Scams Before They Strike With{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent underline decoration-cyan-500/40">
              CyberShield AI
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Real-time multi-vector threat intelligence. Instantly evaluate suspicious URLs, Emails, SMS, QR Codes, Voice Calls, Screenshots, and Domains using Machine Learning & Explainable AI.
          </p>

          {/* FRONT PAGE USER REGISTRATION / SIGN IN / ADMIN PORTAL CARD */}
          {!user ? (
            <div className="max-w-lg mx-auto bg-[#0b1320]/95 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-cyan-500/25 shadow-[0_0_50px_rgba(0,240,255,0.08)] space-y-7 text-left">
              
              {/* Title & Subtitle */}
              <div className="text-center space-y-1.5">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {authMode === 'register' ? 'Register New User' : authMode === 'login' ? 'Sign In User' : 'Admin Portal'}
                </h3>
                <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
                  {authMode === 'register'
                    ? 'CREATE ACCOUNT & ACCESS AI SUITE'
                    : authMode === 'login'
                    ? 'AUTHENTICATE TO ACCESS AI SUITE'
                    : 'RESTRICTED ADMINISTRATOR ACCESS'}
                </p>
              </div>

              {/* 3-Tab Bar Switcher */}
              <div className="flex rounded-2xl bg-[#060b14] border border-slate-800 p-1.5 justify-between">
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); setUsername(''); setEmail(''); setPassword(''); }}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                    authMode === 'register'
                      ? 'bg-[#092236] text-cyan-300 border border-cyan-500/40 shadow-neon'
                      : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); setUsername(''); setEmail(''); setPassword(''); }}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                    authMode === 'login'
                      ? 'bg-[#092236] text-cyan-300 border border-cyan-500/40 shadow-neon'
                      : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('admin'); setAuthError(''); setUsername(''); setEmail(''); setPassword(''); }}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                    authMode === 'admin'
                      ? 'bg-[#1e1338] text-purple-300 border border-purple-500/40 shadow-neon'
                      : 'text-slate-400 hover:text-purple-300'
                  }`}
                >
                  Admin Portal
                </button>
              </div>

              {authMode === 'login' && (
                <div className="p-3 rounded-xl bg-[#060c17] border border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">⚡ DEMO CREDENTIALS:</span>
                  <button
                    type="button"
                    onClick={() => { setUsername('demouser'); setPassword('user123'); setAuthError(''); }}
                    className="py-1 px-3 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/25 transition-colors cursor-pointer"
                  >
                    Fill Demo User
                  </button>
                </div>
              )}

              {infoMsg && (
                <div className="p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono text-center flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{infoMsg}</span>
                </div>
              )}

              {authError && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono text-center flex items-center justify-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleFrontPageAuth} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    {authMode === 'admin' ? 'USERNAME / ADMIN EMAIL' : 'USERNAME'}
                  </label>
                  <div className="relative">
                    {authMode === 'admin' ? (
                      <Lock className="absolute left-4 top-3.5 w-4 h-4 text-purple-400" />
                    ) : (
                      <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    )}
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#060c17] border text-slate-100 text-sm outline-none font-mono transition-colors ${
                        authMode === 'admin' ? 'border-purple-500/50 focus:border-purple-400' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                      placeholder={authMode === 'admin' ? 'Enter admin username or email' : 'Enter username'}
                    />
                  </div>
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#060c17] border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 outline-none font-mono transition-colors"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-3.5 w-4 h-4 ${authMode === 'admin' ? 'text-purple-400' : 'text-slate-500'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#060c17] border text-slate-100 text-sm outline-none font-mono transition-colors ${
                        authMode === 'admin' ? 'border-purple-500/50 focus:border-purple-400' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-4 top-3.5 transition-colors cursor-pointer ${
                        authMode === 'admin' ? 'text-purple-400/70 hover:text-purple-300' : 'text-slate-500 hover:text-cyan-400'
                      }`}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className={`w-full py-4 rounded-2xl text-black font-extrabold text-base transition-all flex items-center justify-center space-x-2 border cursor-pointer ${
                    authMode === 'admin'
                      ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.4)] border-purple-400/40'
                      : 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black shadow-[0_0_25px_rgba(0,240,255,0.4)] border-cyan-300/30'
                  }`}
                >
                  {authLoading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>Submit</span>
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-sm flex items-center justify-between">
              <span>Authenticated as: <strong>{user.username}</strong></span>
              <Link to="/dashboard" className="px-4 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hover:bg-cyan-500/30">
                Go to Dashboard →
              </Link>
            </div>
          )}

          {/* Quick Scanner Bar */}
          <form onSubmit={handleQuickScan} className="max-w-3xl mx-auto glass-panel p-2 rounded-2xl border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center space-x-3 px-4 py-2 w-full text-slate-300">
              <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Paste suspicious URL, domain, or message here (e.g. amaz0n-secure-login.xyz)..."
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-slate-100 placeholder-slate-500 text-sm font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm tracking-wide shadow-neon hover:scale-105 transition-transform flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <span>Scan Threat Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono text-slate-400">
            <span>Try Presets:</span>
            <button
              onClick={() => {
                setQuickInput('https://amaz0n-secure-login.xyz');
                navigate('/scanners', { state: { prefillInput: 'https://amaz0n-secure-login.xyz', prefillType: 'url' } });
              }}
              className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-cyan-300 hover:border-cyan-400 transition-colors"
            >
              Phishing URL
            </button>
            <button
              onClick={() => {
                navigate('/scanners', { state: { prefillType: 'email' } });
              }}
              className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-cyan-300 hover:border-cyan-400 transition-colors"
            >
              Paytm Email
            </button>
            <button
              onClick={() => {
                navigate('/scanners', { state: { prefillType: 'sms' } });
              }}
              className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-cyan-300 hover:border-cyan-400 transition-colors"
            >
              Lottery SMS
            </button>
          </div>

          {/* Trust Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-10">
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 text-center">
              <div className="text-3xl font-extrabold text-cyan-400 font-mono">99.4%</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-mono">AI Accuracy</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 text-center">
              <div className="text-3xl font-extrabold text-blue-400 font-mono">&lt; 50ms</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-mono">Detection Latency</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 text-center">
              <div className="text-3xl font-extrabold text-purple-400 font-mono">8 Modules</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-mono">Multi-Vector Suite</div>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 text-center">
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">Real-Time</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-mono">Socket Monitoring</div>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-cyan-500/20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <Shield className="w-4 h-4" />
              <span>About CyberShield AI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
              Next-Generation Autonomous Cyber Threat Intelligence
            </h2>
            <p className="text-slate-300 leading-relaxed">
              CyberShield AI combines Advanced Natural Language Processing (NLP), Scikit-Learn Machine Learning models, and Explainable AI (XAI) to neutralize modern digital fraud. From typosquatted domain attacks to voice call social engineering, our system dissects every threat vector with clear human-readable explanations.
            </p>
            <div className="space-y-3 font-mono text-sm text-slate-300">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span>Zero-delay risk scoring with transparent Explainable AI triggers</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span>Instant downloadable PDF threat audit reports with verification signatures</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <span>Direct integration with 1930 Cyber Helpline & one-click reporting</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 shadow-neon space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-cyan-400 font-bold">PIPELINE AUDIT TRAIL</span>
                <span className="text-emerald-400">STATUS: 200 OK</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <div 
                  onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'url', prefillInput: 'https://amaz0n-secure-login.xyz' } })}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/40 flex items-center justify-between cursor-pointer transition-all group"
                  title="Click to inspect URL Input Validation scanner"
                >
                  <span className="group-hover:text-cyan-300 font-mono text-xs">1. Input Validation</span>
                  <span className="text-cyan-400 font-mono text-xs font-bold flex items-center space-x-1">
                    <span>Validated</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                <div 
                  onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'email' } })}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/40 flex items-center justify-between cursor-pointer transition-all group"
                  title="Click to inspect NLP Feature Extraction"
                >
                  <span className="group-hover:text-cyan-300 font-mono text-xs">2. NLP Feature Extraction</span>
                  <span className="text-cyan-400 font-mono text-xs font-bold flex items-center space-x-1">
                    <span>Extracted</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                <div 
                  onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'sms' } })}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-red-500/50 hover:bg-red-950/40 flex items-center justify-between cursor-pointer transition-all group"
                  title="Click to inspect ML Model Prediction"
                >
                  <span className="group-hover:text-red-300 font-mono text-xs">3. Scikit-Learn Model Prediction</span>
                  <span className="text-red-400 font-mono text-xs font-bold flex items-center space-x-1">
                    <span>Risk 96%</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                <div 
                  onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'ocr' } })}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:bg-amber-950/40 flex items-center justify-between cursor-pointer transition-all group"
                  title="Click to inspect Brand Impersonation OCR Check"
                >
                  <span className="group-hover:text-amber-300 font-mono text-xs">4. Brand Impersonation Check</span>
                  <span className="text-amber-400 font-mono text-xs font-bold flex items-center space-x-1">
                    <span>Amazon Spoof</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>

                <div 
                  onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'domain' } })}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-cyan-950/40 flex items-center justify-between cursor-pointer transition-all group"
                  title="Click to inspect Explainable AI Audit"
                >
                  <span className="group-hover:text-cyan-300 font-mono text-xs">5. Explainable AI Audit</span>
                  <span className="text-cyan-400 font-mono text-xs font-bold flex items-center space-x-1">
                    <span>5 Reasons</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CYBER VIBE SHOWCASE: RADAR HUD & CLI TERMINAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* 1. 360-Degree Live Cyber Radar HUD */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative overflow-hidden space-y-5">
            
            {/* HUD Header Bar */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div 
                onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'url' } })}
                className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider cursor-pointer hover:text-cyan-300 transition-colors group"
                title="Click to open AI Threat Scanners Page"
              >
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse group-hover:scale-110 transition-transform" />
                <span>360° LIVE CYBER RADAR HUD</span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 group-hover:bg-cyan-500/20">
                  PRESS TO OPEN SCANNER ➔
                </span>
              </div>

              <button 
                onClick={() => setTelemetryModalView('main')}
                className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 hover:scale-105 transition-all flex items-center space-x-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                title="Click to open Live Heartbeat Telemetry Stream"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>ACTIVE MONITOR</span>
              </button>
            </div>

            {/* Circular Radar Sweep Graphic with Interactive Beacons */}
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              {/* Radar Outer Rings */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-pulse" />
              <div className="absolute inset-6 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-16 rounded-full border border-cyan-500/20" />
              <div className="absolute inset-24 rounded-full border border-cyan-500/20" />

              {/* Crosshair lines */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-cyan-500/30" />
              <div className="absolute inset-y-0 left-1/2 w-[1px] bg-cyan-500/30" />

              {/* Sweeping Radar Scanner Line */}
              <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                <div className="w-1/2 h-1/2 bg-gradient-to-tr from-cyan-400/40 via-cyan-400/10 to-transparent radar-line" />
              </div>

              {/* Threat Target Beacon 1: PHISH_SPOOF (Red) */}
              <button 
                onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'url', prefillInput: 'https://amaz0n-secure-login.xyz' } })}
                className="absolute top-10 left-12 flex items-center space-x-1 px-2 py-1 rounded-lg bg-red-950/80 border border-red-500/50 hover:bg-red-900 hover:border-red-400 hover:scale-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.4)] z-20 group"
                title="Tap to scan PHISH_SPOOF URL target"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
                <span className="text-[9px] font-mono text-red-300 font-bold group-hover:text-white">PHISH_SPOOF ➔</span>
              </button>

              {/* Threat Target Beacon 2: MALWARE_DROP (Amber) */}
              <button 
                onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'domain', prefillInput: 'malware-drop-payload.org' } })}
                className="absolute bottom-14 right-8 flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-950/80 border border-amber-500/50 hover:bg-amber-900 hover:border-amber-400 hover:scale-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.4)] z-20 group"
                title="Tap to scan MALWARE_DROP domain target"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
                <span className="text-[9px] font-mono text-amber-200 font-bold group-hover:text-white">MALWARE_DROP ➔</span>
              </button>

              {/* Threat Target Beacon 3: PORT_443_SECURE (Cyan) */}
              <button 
                onClick={() => setTelemetryModalView('encryption')}
                className="absolute bottom-16 left-12 flex items-center space-x-1 px-2 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 hover:bg-cyan-900 hover:border-cyan-400 hover:scale-110 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)] z-20 group"
                title="Tap to inspect Port 443 SSL Security Encryption"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
                <span className="text-[9px] font-mono text-cyan-200 font-bold group-hover:text-white">PORT_443_SECURE ➔</span>
              </button>

              {/* Center Interactive Radar Button: SCANNER READY */}
              <button 
                onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'url', prefillInput: 'https://amaz0n-secure-login.xyz' } })}
                className="z-10 text-center font-mono p-3 rounded-2xl bg-[#060c17]/90 border border-cyan-500/50 hover:border-cyan-300 hover:bg-cyan-950/60 hover:scale-110 transition-all cursor-pointer group shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                title="Click to launch AI Cyber Defense Scanner"
              >
                <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-1 animate-beacon group-hover:scale-110 transition-transform" />
                <span className="text-[10px] text-cyan-300 font-bold tracking-widest uppercase block group-hover:text-white">SCANNER READY</span>
                <span className="text-[9px] text-cyan-400/90 font-bold block mt-0.5">[ ⚡ PRESS TO SCAN ]</span>
              </button>
            </div>

            {/* Telemetry Meter Bar */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center font-mono text-xs">
              <div 
                onClick={() => setTelemetryModalView('packets')}
                className="p-2.5 rounded-xl bg-[#060c17] border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-950/40 hover:scale-[1.03] transition-all cursor-pointer group"
                title="Click to view Packet Telemetry Stream"
              >
                <div className="text-[10px] text-slate-400 group-hover:text-cyan-300">PACKETS</div>
                <div className="text-cyan-400 font-bold text-sm">4,120 /s</div>
                <div className="text-[9px] text-cyan-500/80 mt-0.5">Tap Telemetry ➔</div>
              </div>

              <div 
                onClick={() => navigate(user ? '/history' : '/login')}
                className="p-2.5 rounded-xl bg-[#060c17] border border-purple-500/20 hover:border-purple-400 hover:bg-purple-950/40 hover:scale-[1.03] transition-all cursor-pointer group"
                title="Click to open Threat History Audit Logs"
              >
                <div className="text-[10px] text-slate-400 group-hover:text-purple-300">THREATS</div>
                <div className="text-purple-400 font-bold text-sm">185 BLOCKED</div>
                <div className="text-[9px] text-purple-400/80 mt-0.5">Threat Logs ➔</div>
              </div>

              <div 
                onClick={() => setTelemetryModalView('latency')}
                className="p-2.5 rounded-xl bg-[#060c17] border border-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-950/40 hover:scale-[1.03] transition-all cursor-pointer group"
                title="Click to view Node Latency & Server Health"
              >
                <div className="text-[10px] text-slate-400 group-hover:text-emerald-300">LATENCY</div>
                <div className="text-emerald-400 font-bold text-sm">4 ms</div>
                <div className="text-[9px] text-emerald-500/80 mt-0.5">Node Health ➔</div>
              </div>
            </div>

            {/* Quick Action Navigation Strip for Radar HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-cyan-500/20 text-center font-mono text-[11px]">
              <button
                onClick={() => navigate(user ? '/scanners' : '/login')}
                className="py-2 px-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>🎯 AI Scanners</span>
              </button>
              <button
                onClick={() => navigate(user ? '/dashboard' : '/login')}
                className="py-2 px-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>📊 Dashboard</span>
              </button>
              <button
                onClick={() => navigate(user ? '/history' : '/login')}
                className="py-2 px-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>📜 Threat History</span>
              </button>
              <button
                onClick={() => navigate(user ? '/report-incident' : '/login')}
                className="py-2 px-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 hover:border-red-400 font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>🚨 Report Incident</span>
              </button>
            </div>

          </div>

          {/* 2. Interactive Cyber Terminal Sandbox */}
          <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center space-x-2 text-purple-300 text-xs font-bold">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>CYBERSHIELD INTERACTIVE TERMINAL</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
            </div>

            {/* Terminal Output Log Container */}
            <div className="h-60 overflow-y-auto bg-[#030712] p-4 rounded-2xl border border-slate-800 text-xs space-y-2 font-mono text-slate-300">
              {terminalLogs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  {log.type === 'sys' && <span className="text-cyan-400 font-semibold">[SYS] {log.text}</span>}
                  {log.type === 'user' && <span className="text-amber-300 font-bold">{log.text}</span>}
                  {log.type === 'res' && <span className="text-emerald-300">{log.text}</span>}
                  {log.type === 'err' && <span className="text-red-400">{log.text}</span>}
                </div>
              ))}
            </div>

            {/* Quick Command Pills Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="text-purple-400 font-bold">TAP COMMAND:</span>
              <button
                type="button"
                onClick={(e) => handleTerminalSubmit(e, 'scan')}
                className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 cursor-pointer"
              >
                $ scan ➔
              </button>
              <button
                type="button"
                onClick={(e) => handleTerminalSubmit(e, 'status')}
                className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30 cursor-pointer"
              >
                $ status ➔
              </button>
              <button
                type="button"
                onClick={(e) => handleTerminalSubmit(e, 'threats')}
                className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
              >
                $ threats ➔
              </button>
              <button
                type="button"
                onClick={(e) => handleTerminalSubmit(e, 'report')}
                className="px-2 py-0.5 rounded bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/30 cursor-pointer"
              >
                $ report ➔
              </button>
              <button
                type="button"
                onClick={(e) => handleTerminalSubmit(e, 'learning')}
                className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 cursor-pointer"
              >
                $ learning ➔
              </button>
            </div>

            {/* Command Input Box */}
            <form onSubmit={(e) => handleTerminalSubmit(e)} className="flex space-x-2 pt-1">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-3 text-cyan-400 font-bold text-xs">$</span>
                <input
                  type="text"
                  value={cmdInput}
                  onChange={(e) => setCmdInput(e.target.value)}
                  placeholder="Type 'help', 'scan', 'status', 'report', or 'learning'..."
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#030712] border border-purple-500/30 text-cyan-200 text-xs focus:border-cyan-400 outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-purple-600/30 border border-purple-500/50 text-purple-200 hover:bg-purple-600/50 text-xs font-bold transition-colors cursor-pointer"
              >
                Run
              </button>
            </form>
          </div>

        </div>

        {/* 3D CYBER FRAUD DETECTION VISUALIZER SHOWCASE CARD */}
        <div className="mt-8 glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] relative overflow-hidden font-mono">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-cyan-500/20 pb-4 mb-4 gap-3">
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
              <Box className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>3D HOLOGRAPHIC FRAUD DETECTION SHIELD MATRIX</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                3D PERSPECTIVE: MOUSE INTERACTIVE
              </span>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold animate-pulse">
                ⚡ TAP ANY OPTION TO OPEN
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 cursor-pointer group" onClick={() => setMatrixModal('projection')}>
              <Cyber3DVisualizer height={260} />
              <p className="text-center text-[10px] text-cyan-400/80 mt-1 group-hover:text-cyan-300 font-mono transition-colors">
                [ 🔍 CLICK 3D HOLOGRAM MATRIX TO EXPAND SPATIAL CONTROLLER ]
              </p>
            </div>
            <div className="md:col-span-5 space-y-3 text-xs text-slate-300">
              
              {/* Option 1: 3D Matrix Projection */}
              <div 
                onClick={() => setMatrixModal('projection')}
                className="p-3.5 rounded-2xl bg-[#060c17] border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/30 flex items-center justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] group"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-300 font-bold group-hover:text-cyan-300 transition-colors">3D Matrix Projection:</span>
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <span className="text-[10px] text-slate-500 block">Tap to open X-Y-Z spatial grid</span>
                </div>
                <span className="text-cyan-400 font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all">
                  X, Y, Z Active ➔
                </span>
              </div>

              {/* Option 2: Threat Particle Orbit */}
              <div 
                onClick={() => setMatrixModal('beacons')}
                className="p-3.5 rounded-2xl bg-[#060c17] border border-purple-500/30 hover:border-purple-400 hover:bg-purple-950/30 flex items-center justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] group"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-300 font-bold group-hover:text-purple-300 transition-colors">Threat Particle Orbit:</span>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <span className="text-[10px] text-slate-500 block">Tap to explore 35 threat beacons</span>
                </div>
                <span className="text-purple-400 font-bold px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 group-hover:bg-purple-500/20 transition-all">
                  35 Beacons ➔
                </span>
              </div>

              {/* Option 3: 3D Tilt Response */}
              <div 
                onClick={() => setMatrixModal('tilt')}
                className="p-3.5 rounded-2xl bg-[#060c17] border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/30 flex items-center justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] group"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-300 font-bold group-hover:text-emerald-300 transition-colors">3D Tilt Response:</span>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <span className="text-[10px] text-slate-500 block">Tap to open gyroscopic telemetry</span>
                </div>
                <span className="text-emerald-400 font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-all">
                  Live Tracking ➔
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 8 SCANNER SERVICES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">
            8 Comprehensive AI Cyber Defense Modules
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Covering all modern attack surfaces used by cyber fraudsters to steal credentials, money, and personal identities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div 
            onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'url' } })}
            className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20 hover:border-cyan-400 cursor-pointer transition-all hover:scale-[1.03] group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-300">URL Scanner</h3>
            <p className="text-xs text-slate-400">Inspects SSL validity, domain age, credential theft forms, and typo-squatting.</p>
            <span className="text-xs font-mono text-cyan-400 flex items-center space-x-1 group-hover:underline">
              <span>Try URL Scanner</span><ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div 
            onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'email' } })}
            className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20 hover:border-blue-400 cursor-pointer transition-all hover:scale-[1.03] group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-300">Email Scanner</h3>
            <p className="text-xs text-slate-400">Validates header spoofing, fake bank domains, and urgent pressure keywords.</p>
            <span className="text-xs font-mono text-blue-400 flex items-center space-x-1 group-hover:underline">
              <span>Try Email Scanner</span><ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div 
            onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'sms' } })}
            className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20 hover:border-purple-400 cursor-pointer transition-all hover:scale-[1.03] group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-300">SMS Scanner</h3>
            <p className="text-xs text-slate-400">Detects lottery rewards, fake UPI prize traps, and shortened obfuscated links.</p>
            <span className="text-xs font-mono text-purple-400 flex items-center space-x-1 group-hover:underline">
              <span>Try SMS Scanner</span><ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div 
            onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'qr' } })}
            className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20 hover:border-amber-400 cursor-pointer transition-all hover:scale-[1.03] group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300">QR Scanner</h3>
            <p className="text-xs text-slate-400">Decodes hidden QR code URLs to prevent quishing and rogue payment gateway traps.</p>
            <span className="text-xs font-mono text-amber-400 flex items-center space-x-1 group-hover:underline">
              <span>Try QR Scanner</span><ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div 
            onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'voice' } })}
            className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20 hover:border-red-400 cursor-pointer transition-all hover:scale-[1.03] group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-red-300">Voice Scam Detector</h3>
            <p className="text-xs text-slate-400">Analyzes audio transcripts for OTP pressure, bank blockage claims, and vishing.</p>
            <span className="text-xs font-mono text-red-400 flex items-center space-x-1 group-hover:underline">
              <span>Try Voice Scam</span><ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div 
            onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'screenshot' } })}
            className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20 hover:border-emerald-400 cursor-pointer transition-all hover:scale-[1.03] group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300">Screenshot Analysis</h3>
            <p className="text-xs text-slate-400">Visual OCR brand cloning inspection for Amazon, SBI, Paytm visual clones.</p>
            <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1 group-hover:underline">
              <span>Try Screenshot OCR</span><ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div 
            onClick={() => navigate(user ? '/scanners' : '/login', { state: { prefillType: 'domain' } })}
            className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20 hover:border-sky-400 cursor-pointer transition-all hover:scale-[1.03] group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-sky-300">Domain Reputation</h3>
            <p className="text-xs text-slate-400">Evaluates WHOIS domain registration age, DNS records, and global blacklists.</p>
            <span className="text-xs font-mono text-sky-400 flex items-center space-x-1 group-hover:underline">
              <span>Check Domain</span><ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div 
            onClick={() => window.dispatchEvent(new CustomEvent('open-cyber-guard'))}
            className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20 hover:border-indigo-400 cursor-pointer transition-all hover:scale-[1.03] group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300">AI Chat Assistant</h3>
            <p className="text-xs text-slate-400">Interactive 24/7 conversational cybersecurity counselor for instant guidance.</p>
            <span className="text-xs font-mono text-indigo-400 flex items-center space-x-1 group-hover:underline">
              <span>Ask AI Counselor</span><ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-100">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm">Everything you need to know about CyberShield AI threat detection.</p>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>How does CyberShield AI detect phishing URLs?</span>
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              CyberShield AI combines typo-squatting algorithms, SSL certificate authority checks, domain registration WHOIS age analysis, and visual login form detection to generate an Explainable AI risk score.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Can I test the system with sample demo inputs?</span>
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Yes! Every scanner module includes a "Load Demo Input" preset button (e.g., amaz0n-secure-login.xyz, Paytm phishing email, Lottery SMS) for instant demonstration without needing external API keys.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Can I download PDF security reports for incident reporting?</span>
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Absolutely. Every scan result includes an instant "Download PDF Report" button that formats complete threat details, confidence metrics, and XAI reasons into a branded PDF report.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-10 md:p-14 rounded-3xl border border-cyan-500/30 text-center space-y-6 shadow-neon relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10"></div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-100">
            Protect Yourself Against Cyber Scams Today
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-base">
            Start scanning suspicious links, emails, and messages with CyberShield AI. Free for individual security audits.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to={user ? "/scanners" : "/login"}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-base shadow-neon hover:scale-105 transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Free AI Scan Now</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base hover:bg-slate-700 transition-colors flex items-center justify-center"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive 3D Matrix Holographic Telemetry Modals */}
      <CyberMatrixModals 
        activeModal={matrixModal} 
        onClose={() => setMatrixModal(null)} 
        user={user} 
      />

      {/* Interactive Heartbeat Telemetry Modal */}
      <HeartbeatTelemetryModal 
        activeSubView={telemetryModalView} 
        onClose={() => setTelemetryModalView(null)} 
      />

      {/* Interactive AI Scanner Property Modal */}
      <AIScannerPropertyModal 
        property={selectedPropertyModal} 
        onClose={() => setSelectedPropertyModal(null)} 
        onExecuteScan={(prop) => {
          setSelectedPropertyModal(null);
          navigate(user ? '/scanners' : '/login', { state: { prefillType: 'url' } });
        }}
      />

    </div>
  );
}
