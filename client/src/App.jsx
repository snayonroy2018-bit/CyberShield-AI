import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LiveThreatAlerts from './components/LiveThreatAlerts';
import CyberGuardChatbot from './components/CyberGuardChatbot';
import CyberMatrixBackground from './components/CyberMatrixBackground';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import DashboardPage from './pages/DashboardPage';
import ScanModulesPage from './pages/ScanModulesPage';
import ScanHistoryPage from './pages/ScanHistoryPage';
import IncidentReportPage from './pages/IncidentReportPage';
import LearningHubPage from './pages/LearningHubPage';
import AdminPanelPage from './pages/AdminPanelPage';
import AdminLoginPage from './pages/AdminLoginPage';
import LiveShieldPage from './pages/LiveShieldPage';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    const token = localStorage.getItem('cybershield_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.data.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      localStorage.removeItem('cybershield_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('cybershield_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center space-y-4 font-mono">
        <div className="w-14 h-14 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin"></div>
        <p className="text-cyan-400 text-sm">INITIALIZING CYBERSHIELD AI ENVIRONMENT...</p>
      </div>
    );
  }

  // Protected Route Component Guard
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between bg-[#060913] text-slate-100 relative overflow-hidden cyber-scanlines">
        
        {/* Animated Cyber Matrix Canvas Background */}
        <CyberMatrixBackground />
        
        {/* Navigation Header */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Real-time Socket Alert Toast Container */}
        <LiveThreatAlerts />

        {/* Global Floating AI Security Assistant Widget */}
        <CyberGuardChatbot />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
          <Routes>
            {/* Root Route: Shows Landing Page with front page register & sign in */}
            <Route path="/" element={<LandingPage user={user} onLoginSuccess={handleLoginSuccess} />} />

            {/* Auth & Admin Login Routes */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/otp-verify" element={<Navigate to="/login" replace />} />
            <Route path="/admin-portal" element={user?.role === 'admin' ? <Navigate to="/admin" replace /> : <AdminLoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/admin-login" element={user?.role === 'admin' ? <Navigate to="/admin" replace /> : <AdminLoginPage onLoginSuccess={handleLoginSuccess} />} />

            {/* Protected Feature Routes (Require Login/Register First) */}
            <Route path="/live-shield" element={<ProtectedRoute><LiveShieldPage user={user} /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage user={user} /></ProtectedRoute>} />
            <Route path="/scanners" element={<ProtectedRoute><ScanModulesPage user={user} /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><ScanHistoryPage user={user} /></ProtectedRoute>} />
            <Route path="/report-incident" element={<ProtectedRoute><IncidentReportPage user={user} /></ProtectedRoute>} />
            <Route path="/learning-hub" element={<ProtectedRoute><LearningHubPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminPanelPage user={user} /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </Router>
  );
}
