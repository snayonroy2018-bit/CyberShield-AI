import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, KeyRound, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function OTPVerificationPage({ onLoginSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || 'user@gmail.com';
  const initialMsg = location.state?.msg || `Real 6-digit OTP sent to ${email}. Please check your email inbox.`;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [infoMsg, setInfoMsg] = useState(initialMsg);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // 10-Minute Countdown Timer (600 Seconds)
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (timeLeft <= 0) {
      setError('OTP security code has expired after 10 minutes. Please click "Renew OTP" to receive a new code.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      if (res.data.success && res.data.token) {
        localStorage.setItem('cybershield_token', res.data.token);
        if (onLoginSuccess) {
          onLoginSuccess(res.data.user);
        }
        if (res.data.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid 6-digit OTP code. Please check your email inbox.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/resend-otp', { email });
      setTimeLeft(600);
      setInfoMsg(res.data.msg || `Fresh 6-digit OTP code sent to ${email}. Timer renewed for 10 minutes.`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error sending new OTP email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8">
      
      {/* Top Header Tagline */}
      <div className="text-center mb-6">
        <h1 className="text-xl sm:text-2xl font-medium tracking-wide text-slate-200">Explainable AI.</h1>
      </div>

      {/* Auth Card Matching Screenshot */}
      <div className="w-full max-w-lg bg-[#0b1320]/95 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] border border-cyan-500/25 shadow-[0_0_50px_rgba(0,240,255,0.08)] space-y-7">
        
        {/* Title & Subtitle */}
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center justify-center space-x-2">
            <KeyRound className="w-7 h-7 text-cyan-400" />
            <span>Email OTP Verification</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">ENTER 6-DIGIT CODE SENT TO <span className="text-cyan-400 font-bold">{email}</span></p>
        </div>

        {/* Live Email Banner */}
        {infoMsg && (
          <div className="p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono text-center flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* 10-Minute Expiration Timer & Renew Option */}
        <div className="p-3.5 rounded-2xl bg-[#060c17] border border-slate-800 flex items-center justify-between font-mono">
          <div className="flex items-center space-x-2 text-xs">
            <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-400 animate-ping' : 'text-cyan-400'}`} />
            <span className="text-slate-400 uppercase">OTP Validity:</span>
            <span className={`font-bold text-sm ${timeLeft < 60 ? 'text-red-400' : 'text-cyan-300'}`}>
              {timeLeft > 0 ? formatTimer(timeLeft) : 'EXPIRED'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="py-1.5 px-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-bold hover:bg-cyan-500/30 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin' : ''}`} />
            <span>{resendLoading ? 'Sending...' : 'Renew OTP'}</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono text-center flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 text-center">
              6-DIGIT SECURITY CODE
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full py-4 text-center text-3xl font-mono tracking-[0.6em] rounded-2xl bg-[#060c17] border border-cyan-500/40 text-cyan-300 focus:border-cyan-400 outline-none shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                placeholder="••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black font-extrabold text-base shadow-[0_0_25px_rgba(0,240,255,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 border border-cyan-300/30 cursor-pointer"
          >
            {loading ? <span>Verifying OTP...</span> : (
              <>
                <span>Submit</span>
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
