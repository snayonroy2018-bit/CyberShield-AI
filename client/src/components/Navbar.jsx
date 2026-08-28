import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Activity, Zap, AlertTriangle, BookOpen, Clock, FileText, User, LogOut, Lock, ShieldCheck } from 'lucide-react';
import LiveShieldStatusModal from './LiveShieldStatusModal';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLiveShieldModal, setShowLiveShieldModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-neon group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-7 h-7 text-black stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                  CyberShield
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/30">
                  AI v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider font-mono uppercase">
                Intelligent Fraud & Scam Defense
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/scanners"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/scanners')
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>AI Scanners (8)</span>
            </Link>

            <Link
              to="/history"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/history')
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50'
              }`}
            >
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Scan History</span>
            </Link>

            <Link
              to="/report-incident"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/report-incident')
                  ? 'bg-red-500/15 text-red-300 border border-red-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-red-400 hover:bg-slate-800/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Report Fraud</span>
            </Link>

            <Link
              to="/learning-hub"
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/learning-hub')
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Learning Hub</span>
            </Link>

            {/* STRICT RBAC GUARD: Only render Admin Control when user.role === 'admin' */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-bold font-mono transition-colors ${
                  isActive('/admin')
                    ? 'bg-purple-500/25 text-purple-300 border border-purple-500/60 shadow-neon'
                    : 'text-purple-300 hover:bg-purple-500/20 border border-purple-500/40 bg-purple-500/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Admin Control</span>
              </Link>
            )}
          </div>

          {/* Right User Controls / Auth */}
          <div className="flex items-center space-x-4">
            
            {/* Live Monitoring Badge Button */}
            <button
              onClick={() => navigate(user ? '/live-shield' : '/login')}
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold transition-all cursor-pointer group ${
                isActive('/live-shield')
                  ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
                  : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 hover:border-emerald-400 hover:text-emerald-200'
              }`}
              title="Press to open Live Shield Command Center"
            >
              <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span>LIVE SHIELD ACTIVE ➔</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-cyan-500/20">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-slate-200">{user.username}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    {user.role === 'admin' ? 'ADMIN' : `Score ${user.securityScore || 88}`}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="px-3.5 py-1.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="Log Out of CyberShield AI"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* 1. REGISTER */}
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs sm:text-sm font-bold text-black bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl shadow-neon transition-all duration-300 flex items-center space-x-1"
                >
                  <span>1. Register</span>
                </Link>

                {/* 2. SIGN IN */}
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:text-cyan-300 bg-slate-900/90 border border-slate-700 hover:border-cyan-500/50 rounded-xl transition-colors flex items-center space-x-1"
                >
                  <span>2. Sign In</span>
                </Link>

                {/* 3. ADMIN PORTAL */}
                <Link
                  to="/admin-portal"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-purple-300 hover:text-purple-200 bg-purple-500/10 border border-purple-500/40 hover:bg-purple-500/20 rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>3. Admin Portal</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Shield Status & Telemetry Control Matrix Modal */}
      <LiveShieldStatusModal 
        isOpen={showLiveShieldModal} 
        onClose={() => setShowLiveShieldModal(false)} 
        user={user} 
      />
    </nav>
  );
}
