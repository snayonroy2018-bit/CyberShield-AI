import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Zap, Lock, Search, Cpu, BarChart3, AlertOctagon, CheckCircle2, ChevronRight, MessageSquare, PhoneCall, QrCode, Mail, FileText, ArrowRight, UserCheck, HelpCircle, User, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function LandingPage({ user, onLoginSuccess }) {
  const [quickInput, setQuickInput] = useState('');
  const [authMode, setAuthMode] = useState('register'); // 'register' or 'login'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

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
      const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
      const payload = authMode === 'register' ? { username, password } : { emailOrUsername: username, password };
      
      const res = await api.post(endpoint, payload);
      if (res.data.token && res.data.user) {
        if (authMode === 'admin' && res.data.user.role !== 'admin') {
          setAuthError('Access denied. Administrator privileges required.');
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
            <div className="max-w-md mx-auto glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-5 text-left">
              <div className="text-center space-y-1.5">
                <h3 className="text-xl font-extrabold text-slate-100">
                  {authMode === 'register' ? 'Register New User' : authMode === 'login' ? 'User Sign In' : 'Admin Portal Access'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {authMode === 'register'
                    ? 'CREATE ACCOUNT & ACCESS AI SUITE'
                    : authMode === 'login'
                    ? 'ENTER CREDENTIALS TO ACCESS DASHBOARD'
                    : 'RESTRICTED SYSTEM ADMINISTRATOR ACCESS'}
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex rounded-xl bg-slate-950/80 border border-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); setUsername(''); setPassword(''); }}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    authMode === 'register'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Register
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); setUsername(''); setPassword(''); }}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    authMode === 'login'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('admin'); setAuthError(''); setUsername(''); setPassword(''); }}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-mono font-bold transition-all ${
                    authMode === 'admin'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-purple-300'
                  }`}
                >
                  Admin Portal
                </button>
              </div>

              {authMode === 'login' && (
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">⚡ DEMO USER:</span>
                  <button
                    type="button"
                    onClick={() => { setUsername('demouser'); setPassword('user123'); }}
                    className="py-1 px-2.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/25 transition-colors"
                  >
                    Fill Demo User
                  </button>
                </div>
              )}

              {authError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleFrontPageAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                    {authMode === 'admin' ? 'Username / Identifier' : 'Username'}
                  </label>
                  <div className="relative">
                    {authMode === 'admin' ? (
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-purple-400" />
                    ) : (
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    )}
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border text-slate-100 text-sm outline-none font-mono ${
                        authMode === 'admin' ? 'border-purple-500/50 focus:border-purple-400' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                      placeholder={authMode === 'admin' ? 'Enter username' : 'Enter username'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3.5 top-3 w-4 h-4 ${authMode === 'admin' ? 'text-purple-400' : 'text-slate-500'}`} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border text-slate-100 text-sm outline-none font-mono ${
                        authMode === 'admin' ? 'border-purple-500/50 focus:border-purple-400' : 'border-slate-800 focus:border-cyan-500'
                      }`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className={`w-full py-3.5 rounded-xl text-black font-bold text-sm tracking-wide shadow-neon hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2 ${
                    authMode === 'admin'
                      ? 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-white'
                      : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black'
                  }`}
                >
                  {authLoading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>{authMode === 'register' ? 'Submit' : authMode === 'login' ? 'Sign In' : 'Sign In To Admin Portal'}</span>
                      <CheckCircle2 className="w-4 h-4" />
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
                <div className="p-2 rounded bg-slate-900/80 flex items-center justify-between">
                  <span>1. Input Validation</span>
                  <span className="text-cyan-400">Validated</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 flex items-center justify-between">
                  <span>2. NLP Feature Extraction</span>
                  <span className="text-cyan-400">Extracted</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 flex items-center justify-between">
                  <span>3. Scikit-Learn Model Prediction</span>
                  <span className="text-red-400 font-bold">Risk 96%</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 flex items-center justify-between">
                  <span>4. Brand Impersonation Check</span>
                  <span className="text-amber-400">Amazon Spoof</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 flex items-center justify-between">
                  <span>5. Explainable AI Audit</span>
                  <span className="text-cyan-400">5 Reasons</span>
                </div>
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
          
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">URL Scanner</h3>
            <p className="text-xs text-slate-400">Inspects SSL validity, domain age, credential theft forms, and typo-squatting.</p>
            <Link to="/scanners" className="text-xs font-mono text-cyan-400 flex items-center space-x-1 hover:underline">
              <span>Try URL Scanner</span><ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Email Scanner</h3>
            <p className="text-xs text-slate-400">Validates header spoofing, fake bank domains, and urgent pressure keywords.</p>
            <Link to="/scanners" className="text-xs font-mono text-cyan-400 flex items-center space-x-1 hover:underline">
              <span>Try Email Scanner</span><ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">SMS Scanner</h3>
            <p className="text-xs text-slate-400">Detects lottery rewards, fake UPI prize traps, and shortened obfuscated links.</p>
            <Link to="/scanners" className="text-xs font-mono text-cyan-400 flex items-center space-x-1 hover:underline">
              <span>Try SMS Scanner</span><ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">QR Scanner</h3>
            <p className="text-xs text-slate-400">Decodes hidden QR code URLs to prevent quishing and rogue payment gateway traps.</p>
            <Link to="/scanners" className="text-xs font-mono text-cyan-400 flex items-center space-x-1 hover:underline">
              <span>Try QR Scanner</span><ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Voice Scam Detector</h3>
            <p className="text-xs text-slate-400">Analyzes audio transcripts for OTP pressure, bank blockage claims, and vishing.</p>
            <Link to="/scanners" className="text-xs font-mono text-cyan-400 flex items-center space-x-1 hover:underline">
              <span>Try Voice Scam</span><ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Screenshot Analysis</h3>
            <p className="text-xs text-slate-400">Visual OCR brand cloning inspection for Amazon, SBI, Paytm visual clones.</p>
            <Link to="/scanners" className="text-xs font-mono text-cyan-400 flex items-center space-x-1 hover:underline">
              <span>Try Screenshot OCR</span><ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Domain Reputation</h3>
            <p className="text-xs text-slate-400">Evaluates WHOIS domain registration age, DNS records, and global blacklists.</p>
            <Link to="/scanners" className="text-xs font-mono text-cyan-400 flex items-center space-x-1 hover:underline">
              <span>Check Domain</span><ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-3 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">AI Chat Assistant</h3>
            <p className="text-xs text-slate-400">Interactive 24/7 conversational cybersecurity counselor for instant guidance.</p>
            <Link to="/scanners" className="text-xs font-mono text-cyan-400 flex items-center space-x-1 hover:underline">
              <span>Ask AI Counselor</span><ChevronRight className="w-3.5 h-3.5" />
            </Link>
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
              to="/scanners"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-base shadow-neon hover:scale-105 transition-all"
            >
              Start Free AI Scan Now
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-base hover:bg-slate-700 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
