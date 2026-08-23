import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Cpu, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/20 bg-[#060911] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-neon">
              <Shield className="w-5 h-5 text-black stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold text-slate-100 tracking-tight">CyberShield AI</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Enterprise-grade intelligent phishing & scam fraud detection engine powered by NLP, Scikit-learn ML models, and Explainable AI (XAI).
          </p>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Cpu className="w-4 h-4" />
            <span>AI ENGINE 2.4 ONLINE</span>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 font-mono">
            AI Scan Modules
          </h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/scanners" className="hover:text-cyan-400 transition-colors">URL Phishing Scanner</a></li>
            <li><a href="/scanners" className="hover:text-cyan-400 transition-colors">Email Spoofing Inspection</a></li>
            <li><a href="/scanners" className="hover:text-cyan-400 transition-colors">SMS Prize Fraud Detection</a></li>
            <li><a href="/scanners" className="hover:text-cyan-400 transition-colors">QR Code Decoder & Risk</a></li>
            <li><a href="/scanners" className="hover:text-cyan-400 transition-colors">Voice Scam / OTP Fraud</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 font-mono">
            Security Tools
          </h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/scanners" className="hover:text-cyan-400 transition-colors">Screenshot OCR Analysis</a></li>
            <li><a href="/scanners" className="hover:text-cyan-400 transition-colors">Domain Reputation Checker</a></li>
            <li><a href="/scanners" className="hover:text-cyan-400 transition-colors">AI Chat Assistant</a></li>
            <li><a href="/report-incident" className="hover:text-red-400 transition-colors">One-Click Incident Report</a></li>
            <li><a href="/learning-hub" className="hover:text-cyan-400 transition-colors">Cyber Awareness Quiz</a></li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 font-mono">
            Cyber Helpline & Emergency
          </h4>
          <p className="text-sm text-slate-400 mb-3">
            If you are a victim of financial cyber fraud, immediately dial national helpline:
          </p>
          <div className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-center font-bold text-lg mb-3">
            ☎ 1930 Cyber Fraud Helpline
          </div>
          <p className="text-xs text-slate-400">
            ISO 27001 Certified SOC Threat Intelligence Feed.
          </p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
        <p>© 2026 CyberShield AI. All rights reserved. Production Ready Academic Project Build.</p>
        <div className="flex items-center space-x-6 mt-4 md:mt-0 font-mono">
          <span className="flex items-center space-x-1"><Lock className="w-3.5 h-3.5 text-cyan-400" /><span>256-bit SSL</span></span>
          <span className="flex items-center space-x-1"><Globe className="w-3.5 h-3.5 text-blue-400" /><span>Global Network</span></span>
          <Link to="/admin-portal" className="text-slate-500 hover:text-purple-400 transition-colors flex items-center space-x-1">
            <Lock className="w-3 h-3 text-purple-400" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
