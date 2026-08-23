import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, KeyRound, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function OTPVerificationPage({ onLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();

  const simulatedOTP = location.state?.simulatedOTP || '123456';
  const email = location.state?.email || 'user@cybershield.ai';

  const [otp, setOtp] = useState(simulatedOTP);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/verify-otp', { otp });
      if (res.data.success) {
        if (onLoginSuccess) {
          onLoginSuccess({ username: 'New User', email, securityScore: 88, role: 'user' });
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid OTP code. Use 123456.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-2xl space-y-6">

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-neon mx-auto flex items-center justify-center">
            <KeyRound className="w-7 h-7 text-black stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">OTP Security Verification</h2>
          <p className="text-xs text-slate-400 font-mono">ENTER 6-DIGIT VERIFICATION CODE SENT TO {email}</p>
        </div>

        {/* Demo Helper Banner */}
        <div className="p-3 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center justify-between">
          <span>SIMULATED TEST OTP CODE:</span>
          <span className="font-bold text-base text-cyan-400 tracking-wider">123456</span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 text-center">
              6-Digit One-Time Password
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full py-3.5 text-center text-2xl font-mono tracking-widest rounded-xl bg-slate-950/80 border border-cyan-500/40 text-cyan-300 focus:border-cyan-400 outline-none shadow-neon"
              placeholder="123456"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm tracking-wide shadow-neon hover:scale-[1.02] transition-transform flex items-center justify-center space-x-2"
          >
            {loading ? <span>Verifying...</span> : (
              <>
                <span>Confirm & Access Dashboard</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
