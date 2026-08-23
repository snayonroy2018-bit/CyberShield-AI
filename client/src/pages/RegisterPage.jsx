import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function RegisterPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/register', { username, password });
      if (res.data.success) {
        localStorage.setItem('cybershield_token', res.data.token);
        if (onLoginSuccess) {
          onLoginSuccess(res.data.user);
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-neon mx-auto flex items-center justify-center">
            <Shield className="w-7 h-7 text-black stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Create CyberShield Account</h2>
          <p className="text-xs text-slate-400 font-mono">SECURE ACCESS TO AI DETECTION SUITE</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 outline-none font-mono"
                placeholder="Choose username"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
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
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm tracking-wide shadow-neon hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
          >
            {loading ? <span>Submitting...</span> : (
              <>
                <span>Submit</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
