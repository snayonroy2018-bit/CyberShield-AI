import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, FileText, Send, PhoneCall, Sparkles, Edit3, Zap, Shield, Info, Download } from 'lucide-react';
import { api } from '../services/api';
import { generatePDFReport } from '../utils/pdfGenerator';

export default function IncidentReportPage({ user }) {
  const [reportMode, setReportMode] = useState('original'); // 'original', 'demo', 'manual'
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('UPI / Banking Fraud');
  const [targetUrlOrPhone, setTargetUrlOrPhone] = useState('');
  const [lossAmount, setLossAmount] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('HIGH');
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  // Demo Presets Dataset
  const demoPresets = [
    {
      label: '🚨 Fake SBI Account Block SMS',
      title: 'Received Fraudulent SMS Regarding SBI Account Suspension',
      category: 'UPI / Banking Fraud',
      targetUrlOrPhone: 'https://amaz0n-secure-login.xyz',
      lossAmount: '0',
      severity: 'CRITICAL',
      description: 'Received SMS from unknown sender claiming my SBI netbanking is blocked unless I update KYC details via link immediately.'
    },
    {
      label: '💸 UPI Money Transfer Reward Scam',
      title: 'Tricked into Money Transfer via Fake QR Reward Code',
      category: 'UPI / Banking Fraud',
      targetUrlOrPhone: '+91 9876543210',
      lossAmount: '12500',
      severity: 'HIGH',
      description: 'Scammer claimed I won ₹25,000 in cashback reward and sent a QR code. Scanning it deducted ₹12,500 from my bank account instead of crediting.'
    },
    {
      label: '🌐 Fake Amazon Login Website Clone',
      title: 'Credential Theft Attempt via Phishing Domain',
      category: 'Phishing URL / Domain',
      targetUrlOrPhone: 'https://amaz0n-secure-login.xyz',
      lossAmount: '0',
      severity: 'HIGH',
      description: 'Clicked sponsored search result leading to a cloned Amazon login page harvesting usernames and passwords.'
    },
    {
      label: '📞 Voice Vishing / OTP Pressure Call',
      title: 'Impersonation Officer Demanding Aadhaar OTP',
      category: 'Voice Call / OTP Scam',
      targetUrlOrPhone: '+91 9123456789',
      lossAmount: '50000',
      severity: 'CRITICAL',
      description: 'Caller claimed to be a Cyber Police officer threatening legal arrest unless I shared an OTP sent to my mobile number.'
    }
  ];

  const loadPreset = (preset) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setTargetUrlOrPhone(preset.targetUrlOrPhone);
    setLossAmount(preset.lossAmount);
    setDescription(preset.description);
    setSeverity(preset.severity);
  };

  const handleModeChange = (mode) => {
    setReportMode(mode);
    if (mode === 'original') {
      setTitle('');
      setCategory('UPI / Banking Fraud');
      setTargetUrlOrPhone('');
      setLossAmount('');
      setSeverity('HIGH');
      setDescription('');
    } else if (mode === 'demo') {
      loadPreset(demoPresets[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/incidents/report', {
        title,
        category,
        targetUrlOrPhone,
        lossAmount: Number(lossAmount) || 0,
        description,
        severity,
        reportMode
      });
      if (res.data.success) {
        setTicket(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!ticket) return;
    const pdfData = {
      scan_type: `Incident Report (${ticket.incident.reportMode || reportMode})`,
      input: ticket.incident.title,
      threat_type: ticket.incident.category,
      risk_score: ticket.incident.lossAmount > 0 ? 98 : 88,
      confidence: 99,
      risk_classification: { level: 'Incident Reported', color: 'Red', class: 'danger' },
      reasons: [
        `Target: ${ticket.incident.targetUrlOrPhone || 'N/A'}`,
        `Severity: ${ticket.incident.severity}`,
        `Financial Loss: ₹${ticket.incident.lossAmount}`,
        `Description: ${ticket.incident.description}`
      ],
      recommendation: 'Formal incident ticket logged with National Cyber Helpline Queue.'
    };
    generatePDFReport(pdfData, user ? user.username : 'CyberShield User');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
          <AlertTriangle className="w-4 h-4" />
          <span>CYBER CRIME EMERGENCY RESPONSE QUEUE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100">
          Incident Reporting Suite
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Report cyber scams, fake banking links, financial fraud, or vishing calls to our SOC Response Team.
        </p>
      </div>

      {/* 2 Report Type Mode Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2 glass-panel rounded-2xl border border-red-500/30 shadow-xl">
        <button
          type="button"
          onClick={() => handleModeChange('original')}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all card-3d-purple cursor-pointer ${
            reportMode === 'original'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-neon border border-red-400 scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-white" />
          <span>🔴 Original Incident</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('demo')}
          className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-mono text-xs font-bold transition-all card-3d-tilt cursor-pointer ${
            reportMode === 'demo'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-neon border border-amber-300 scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Zap className="w-4 h-4 text-black" />
          <span>⚡ Demo Presets</span>
        </button>
      </div>

      {/* Demo Presets Bar (If Demo Mode Active) */}
      {reportMode === 'demo' && (
        <div className="p-4 rounded-2xl glass-panel border border-amber-500/30 space-y-3">
          <span className="text-xs font-mono text-amber-300 font-bold block flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>SELECT DEMO PRESET SCENARIO TO AUTO-FILL:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {demoPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadPreset(preset)}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 text-xs font-mono text-left hover:border-amber-400/60 hover:bg-amber-500/10 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ticket Success Confirmation Modal */}
      {ticket ? (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 text-center space-y-6 shadow-2xl animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Incident Ticket Created!</h2>
          <div className="inline-block p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-cyan-400 text-lg font-bold">
            TICKET ID: {ticket.ticketId}
          </div>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Your report has been logged with Priority: <strong className="text-red-400">{ticket.incident.severity || severity}</strong>. Our incident response handler is reviewing the evidence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              onClick={handleExportPDF}
              className="py-3 px-6 rounded-xl bg-cyan-500 text-black font-bold text-sm shadow-neon hover:bg-cyan-400 transition-colors flex items-center justify-center space-x-2 font-mono"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Ticket Report</span>
            </button>
            <button
              onClick={() => setTicket(null)}
              className="py-3 px-6 rounded-xl bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition-colors font-mono"
            >
              Report Another Incident
            </button>
          </div>
        </div>
      ) : (
        /* Report Form */
        <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-3xl border border-red-500/30 space-y-6 shadow-2xl">
          
          {/* Mode Indicator Badge */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">ACTIVE REPORT TYPE:</span>
              <span className={`px-2.5 py-0.5 rounded font-bold uppercase ${
                reportMode === 'original'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                  : reportMode === 'demo'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}>
                {reportMode === 'original' ? '🔴 Original Real Incident' : '⚡ Demo Preset'}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400 flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>256-BIT ENCRYPTED SUBMISSION</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Incident Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Received fake SBI account block SMS"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-red-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Fraud Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-red-500 outline-none font-mono"
              >
                <option value="UPI / Banking Fraud">UPI / Banking Fraud</option>
                <option value="Phishing URL / Domain">Phishing URL / Domain</option>
                <option value="Email Impersonation">Email Impersonation</option>
                <option value="Voice Call / OTP Scam">Voice Call / OTP Scam</option>
                <option value="Lottery / Reward Trap">Lottery / Reward Trap</option>
                <option value="Crypto Scam">Crypto Scam</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Suspect URL or Phone
              </label>
              <input
                type="text"
                value={targetUrlOrPhone}
                onChange={(e) => setTargetUrlOrPhone(e.target.value)}
                placeholder="e.g. https://amaz0n-secure-login.xyz"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-red-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Financial Loss (₹ INR)
              </label>
              <input
                type="number"
                value={lossAmount}
                onChange={(e) => setLossAmount(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-red-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-red-500 outline-none font-mono"
              >
                <option value="CRITICAL">CRITICAL (Financial Loss / Active Breach)</option>
                <option value="HIGH">HIGH (Urgent Phishing / Impersonation)</option>
                <option value="MEDIUM">MEDIUM (Suspicious Link / Spam)</option>
                <option value="LOW">LOW (Informational Report)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              Detailed Description & Narrative
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe how you received the message, links clicked, or OTP requested..."
              className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-red-500 outline-none font-mono resize-none"
            />
          </div>

          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs text-red-300 font-mono">
            <span>EMERGENCY HELPLINE: Dial 1930 for immediate financial freeze.</span>
            <PhoneCall className="w-4 h-4 text-red-400" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 text-white font-bold text-sm shadow-glow-red hover:scale-[1.01] transition-transform flex items-center justify-center space-x-2 font-mono uppercase tracking-wider"
          >
            {loading ? (
              <span>Submitting Incident Ticket...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit {reportMode.toUpperCase()} Incident Ticket</span>
              </>
            )}
          </button>
        </form>
      )}

    </div>
  );
}
