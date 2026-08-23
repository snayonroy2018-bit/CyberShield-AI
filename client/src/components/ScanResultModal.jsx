import React from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle, Download, Cpu, ArrowRight, CornerDownRight, Languages, Target, GitCommit, Eye, Brain, CreditCard, Lock, CheckSquare, ShieldCheck } from 'lucide-react';
import { generatePDFReport } from '../utils/pdfGenerator';

export default function ScanResultModal({ scanResult, onClose, user }) {
  if (!scanResult) return null;

  const risk = scanResult.risk_score || scanResult.riskScore || 0;
  const isDanger = risk > 70;
  const isWarning = risk > 40 && risk <= 70;
  const isSafe = risk <= 40;

  const handleDownloadPDF = () => {
    generatePDFReport(scanResult, user ? user.username : 'CyberShield User');
  };

  const lang = scanResult.multilingual_analysis || {};
  const intent = scanResult.scam_intent || {};
  const chain = scanResult.scam_chain || {};
  const nextStep = scanResult.next_step_prediction || {};
  const soc = scanResult.social_engineering || {};
  const pay = scanResult.before_you_pay_protection || scanResult.payment_verdict ? scanResult : {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-cyan-500/30 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto text-slate-100 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl ${
              (scanResult.is_original_link || scanResult.threat_type === 'Verified Original Website' || scanResult.threat_type === 'Verified Merchant')
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : (isDanger ? 'bg-red-500/20 text-red-400 shadow-glow-red' : isWarning ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400')
            }`}>
              {isDanger ? <ShieldAlert className="w-7 h-7" /> : isWarning ? <AlertTriangle className="w-7 h-7" /> : <CheckCircle className="w-7 h-7 text-emerald-400" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold uppercase">
                  {scanResult.scan_type || scanResult.scanType}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Confidence: {scanResult.confidence || 99}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-100 mt-1 flex items-center space-x-2">
                <span>{scanResult.threat_type || scanResult.threatType || 'Security Analysis Completed'}</span>
                {(scanResult.is_original_link || scanResult.threat_type === 'Verified Original Website') && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-400/60 font-bold">
                    ✅ ORIGINAL LINK
                  </span>
                )}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Risk Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${isDanger ? 'bg-red-500/10 border-red-500/30' : isWarning ? 'bg-amber-500/10 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">AI Risk Score</span>
            <div className={`text-3xl font-extrabold font-mono mt-1 ${isDanger ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
              {risk}%
            </div>
            <span className="text-xs font-medium text-slate-300">
              {isDanger ? 'Phishing / Scam Detected' : isWarning ? 'Suspicious Threat' : 'Safe to Proceed'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Scam Intent</span>
            <div className="text-lg font-bold text-cyan-300 mt-1 truncate">
              {intent.primary_intent || 'Evaluated Intent'}
            </div>
            <span className="text-xs text-slate-400">Severity: <strong className="text-amber-400">{intent.severity || 'Standard'}</strong></span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Scam Chain Stage</span>
            <div className="text-base font-bold text-purple-300 mt-1 truncate">
              {chain.current_stage || 'Stage 1'}
            </div>
            <span className="text-xs text-slate-400">Threat: {chain.chain_threat_rating || 'Active Vector'}</span>
          </div>
        </div>

        {/* Evaluated Input snippet */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300">
          <span className="text-slate-400 block mb-1">EVALUATED INPUT PAYLOAD:</span>
          <p className="break-all text-cyan-300">{scanResult.input}</p>
        </div>

        {/* 💳 FEATURE 6: BEFORE YOU PAY PROTECTION SHIELD (If present or payment scan) */}
        {(scanResult.payment_verdict || pay.verdict || scanResult.scan_type === 'Before You Pay Protection') && (
          <div className="p-4 rounded-xl bg-slate-900/90 border-2 border-red-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center space-x-1.5">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <span>Feature 6: Before You Pay Protection Shield</span>
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-mono font-extrabold ${
                risk > 70 ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {scanResult.payment_verdict || pay.verdict || 'BEFORE YOU PAY VERDICT'}
              </span>
            </div>
            {scanResult.beneficiary_identifier && (
              <p className="text-xs font-mono text-slate-300">
                Beneficiary VPA / Handle: <strong className="text-amber-400">{scanResult.beneficiary_identifier}</strong>
              </p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
              {(scanResult.safety_checklist || [
                { check: 'Mule Account Check', passed: risk < 70 },
                { check: 'Merchant VPA Signature', passed: risk < 40 },
                { check: 'No Urgency Pressure', passed: risk < 70 },
                { check: 'Escrow Lock Recommended', passed: risk > 40 }
              ]).map((chk, idx) => (
                <div key={idx} className={`p-2 rounded-lg border ${chk.passed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                  {chk.passed ? '✔ ' : '✖ '} {chk.check}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🌐 FEATURE 1: MULTILINGUAL & CODE-MIXED LANGUAGE BREAKDOWN */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center space-x-2">
              <Languages className="w-4 h-4" />
              <span>Feature 1: Mixed Languages & Code-Mixed NLP Analysis</span>
            </h4>
            <span className="text-xs font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">
              {lang.code_mixed_script || 'Standard Script'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {(lang.detected_languages || ['English']).map((l, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
                🌐 {l}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-300 pt-1 italic">
            Translation / Semantic Intent: {lang.translated_meaning || 'Monolingual language payload evaluated.'}
          </p>
        </div>

        {/* 🎯 FEATURE 2 & 🔮 FEATURE 4: INTENT & NEXT-STEP PREDICTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Feature 2: Scam Intent */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Feature 2: Scam Intent Detection</span>
            </h4>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
              <p className="font-bold text-amber-300 text-sm">{intent.primary_intent || 'Financial Fraud'}</p>
              <p className="text-slate-400 mt-1">{intent.intent_description}</p>
            </div>
            {intent.secondary_intents && intent.secondary_intents.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {intent.secondary_intents.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 text-[11px] font-mono">
                    ⚡ {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Feature 4: Next Step Prediction */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Feature 4: Next Step Scam Prediction</span>
            </h4>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1">
              <span className="text-cyan-300 font-bold block">Predictive Forecast:</span>
              <p className="text-slate-200">{nextStep.predicted_action || 'Scammer will demand OTP or UPI transfer.'}</p>
              <span className="text-red-400 font-semibold block pt-1">Preventative Defense:</span>
              <p className="text-slate-300">{nextStep.preventative_countermeasure || 'Never share OTPs or passwords.'}</p>
            </div>
          </div>

        </div>

        {/* 🔗 FEATURE 3: SCAM CHAIN LIFECYCLE PROGRESSION */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h4 className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center space-x-2">
            <GitCommit className="w-4 h-4" />
            <span>Feature 3: 6-Stage Scam Chain Lifecycle Detection</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {(chain.scam_lifecycle_flow || [
              { step: 1, name: 'Initial Outreach', status: 'Completed' },
              { step: 2, name: 'Authority Claim', status: 'Completed' },
              { step: 3, name: 'Migration', status: 'Predicted' },
              { step: 4, name: 'Credential Test', status: 'Not Reached' },
              { step: 5, name: 'Deposit Trap', status: 'Active' },
              { step: 6, name: 'Extortion Lock', status: 'Prevented' }
            ]).map((st, idx) => (
              <div key={idx} className={`p-2 rounded-lg border text-center text-[11px] font-mono ${
                st.status.includes('Active') || st.status.includes('Completed')
                  ? 'bg-purple-500/20 border-purple-400/50 text-purple-300 font-bold'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}>
                <span className="block text-[10px] text-slate-400">Step {st.step}</span>
                <span className="truncate block font-semibold">{st.name}</span>
                <span className="text-[9px] block text-cyan-400 mt-0.5">{st.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🧠 FEATURE 5: SOCIAL ENGINEERING PSYCHOLOGICAL TRIGGERS */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Feature 5: Social Engineering Psychological Trigger Analysis</span>
            </h4>
            <span className="text-xs font-mono text-amber-300 font-bold">
              Dominant Tactic: {soc.dominant_tactic || 'Urgency & Time Pressure'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(soc.psychological_triggers || {
              "Urgency & Pressure": 95,
              "Fear & Intimidation": 90,
              "Authority Bias": 85,
              "Greed & Lure": 70,
              "Social Proof": 50,
              "Secrecy": 80
            }).map(([trigger, val], idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-300">
                  <span>{trigger}</span>
                  <span className="text-cyan-400 font-bold">{val}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full ${val > 70 ? 'bg-red-400' : val > 40 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Explainable AI (XAI) Reasons */}
        <div>
          <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 font-mono flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Explainable AI (XAI) Detection Reasons</span>
          </h4>
          <div className="space-y-2">
            {(scanResult.reasons || []).map((reason, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200">
                <CornerDownRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations & Action Items */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-cyan-500/30">
          <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 font-mono">
            AI Recommendation & Security Advisory
          </h4>
          <p className="text-xs text-slate-200 font-medium">
            {scanResult.recommendation}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {(scanResult.action_items || scanResult.actionItems || ['Delete Message', 'Block Sender']).map((action, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold">
                ✔ {action}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
          <button
            onClick={handleDownloadPDF}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors flex items-center justify-center space-x-2 shadow-neon"
          >
            <Download className="w-4 h-4" />
            <span>Download Full PDF Security Audit Report</span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors text-xs"
          >
            Close Analysis Window
          </button>
        </div>

      </div>
    </div>
  );
}
