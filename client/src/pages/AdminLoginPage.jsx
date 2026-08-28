import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Key, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

export default function AdminLoginPage({ onLoginSuccess }) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
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
          setError('Access denied. Restricted strictly to System Administrators (snayonroy2018@gmail.com).');
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
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8">
      
      {/* Top Header Tagline */}
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-medium tracking-wide text-slate-200">Explainable AI.</h1>
      </div>

      {/* Auth Card Matching Screenshot */}
      <div className="w-full max-w-lg bg-[#0d101e]/95 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-purple-500/35 shadow-[0_0_50px_rgba(168,85,247,0.12)] space-y-7">
        
        {/* Title & Subtitle */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center space-x-2">
            <span>Admin Portal</span>
          </h2>
          <p className="text-xs text-purple-300 font-mono tracking-widest uppercase">RESTRICTED ADMINISTRATOR ACCESS</p>
        </div>

        {/* 3-Tab Bar Switcher */}
        <div className="flex rounded-2xl bg-[#060b14] border border-slate-800 p-1.5 justify-between">
          <Link
            to="/register"
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-medium text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-colors"
          >
            <span>Register</span>
          </Link>
          <Link
            to="/login"
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-medium text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-colors"
          >
            <span>Sign In</span>
          </Link>
          <Link
            to="/admin-portal"
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold bg-[#1e1338] text-purple-300 border border-purple-500/40 shadow-neon flex items-center justify-center space-x-1"
          >
            <span>Admin Portal</span>
          </Link>
        </div>

        {infoMsg && (
          <div className="p-3.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono text-center flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono text-center flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-purple-200 uppercase tracking-wider mb-2">
              USERNAME / ADMIN EMAIL
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-4 top-3.5 w-4 h-4 text-purple-400" />
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#060c17] border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none font-mono transition-colors"
                placeholder="Enter admin email or username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-purple-200 uppercase tracking-wider mb-2">
              PASSWORD
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-3.5 w-4 h-4 text-purple-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#060c17] border border-slate-800 text-slate-100 text-sm focus:border-purple-500 outline-none font-mono transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-purple-400/70 hover:text-purple-300 transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-base shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 border border-purple-400/40 cursor-pointer"
          >
            {loading ? <span>Authenticating Admin...</span> : (
              <>
                <span>Submit</span>
                <Lock className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
