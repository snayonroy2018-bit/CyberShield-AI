import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage({ onLoginSuccess }) {
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
        localStorage.setItem('cybershield_token', res.data.token);
        onLoginSuccess(res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoUser = () => {
    setEmailOrUsername('demouser');
    setPassword('user123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-neon mx-auto flex items-center justify-center">
            <Shield className="w-7 h-7 text-black stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">CyberShield User Sign In</h2>
          <p className="text-xs text-slate-400 font-mono">AUTHENTICATE TO ACCESS AI THREAT SUITE</p>
        </div>

        {/* Portal Mode Switcher */}
        <div className="flex rounded-xl bg-slate-900/90 border border-slate-800 p-1">
          <div className="flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center space-x-1.5 shadow-sm">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>User Sign In</span>
          </div>
          <Link
            to="/admin-portal"
            className="flex-1 py-2 px-3 rounded-lg text-xs font-mono font-medium text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Demo User Fill Button */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-cyan-400 font-bold">⚡ DEMO USER:</span>
          <button
            type="button"
            onClick={loadDemoUser}
            className="py-1 px-3 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/25 transition-colors"
          >
            Fill Demo User
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 outline-none font-mono"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 outline-none font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm tracking-wide shadow-neon hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
          >
            {loading ? <span>Authenticating...</span> : (
              <>
                <span>Sign In To Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 font-semibold hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
