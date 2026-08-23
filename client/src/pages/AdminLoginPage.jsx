import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Key, ArrowRight, AlertCircle, ShieldAlert, Cpu, User } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLoginPage({ onLoginSuccess }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { emailOrUsername, password });
      if (res.data.token) {
        if (res.data.user?.role !== 'admin') {
          setError('Access denied. This portal is restricted strictly to System Administrators.');
          setLoading(false);
          return;
        }
        localStorage.setItem('cybershield_token', res.data.token);
        onLoginSuccess(res.data.user);
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid Administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-purple-500/40 shadow-2xl space-y-6 relative overflow-hidden">

        {/* Glow Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-neon mx-auto flex items-center justify-center border border-purple-400/40">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-bold tracking-widest uppercase">
            RESTRICTED ACCESS PORTAL
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Admin Control Center</h2>
          <p className="text-xs text-slate-400 font-mono">SYSTEM ADMINISTRATOR AUTHENTICATION</p>
        </div>

        {/* Portal Mode Switcher */}
        <div className="flex rounded-xl bg-slate-900/90 border border-slate-800 p-1">
          <Link
            to="/login"
            className="flex-1 py-2 px-3 rounded-lg text-xs font-mono font-medium text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>User Sign In</span>
          </Link>
          <div className="flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center space-x-1.5 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin Portal</span>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Username / Identifier
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3.5 top-3 w-4 h-4 text-purple-400" />
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none font-mono"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Authorization Password
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3 w-4 h-4 text-purple-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none font-mono"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-sm shadow-neon transition-all duration-300 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                <span>AUTHENTICATING ADMIN...</span>
              </span>
            ) : (
              <>
                <span>Access Admin Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link to="/login" className="text-xs text-slate-400 hover:text-cyan-400 transition-colors font-mono">
            ← Switch to Standard User Login
          </Link>
        </div>

      </div>
    </div>
  );
}
