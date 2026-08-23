import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Shield, Zap, Search, Mail, MessageSquare, QrCode, PhoneCall, Image, Globe, Bot, Upload, Play, Download, CheckCircle, AlertTriangle, Cpu, CornerDownRight, RefreshCw, CreditCard, Languages } from 'lucide-react';
import { api } from '../services/api';
import ScanResultModal from '../components/ScanResultModal';

export default function ScanModulesPage({ user }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('url'); // url, email, sms, qr, voice, screenshot, domain, chat
  
  // Inputs state
  const [inputVal, setInputVal] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hello! I am CyberShield AI Assistant. Ask me anything or paste suspicious messages to check for scams.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Results & Loading
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    if (location.state?.prefillType) {
      setActiveTab(location.state.prefillType);
    }
    if (location.state?.prefillInput) {
      setInputVal(location.state.prefillInput);
    }
  }, [location.state]);

  // Demo presets loader for instant verification of user prompt inputs
  const loadDemoPreset = (type, isOriginal = false, presetVariant = '') => {
    setScanResult(null);
    if (presetVariant === 'tanglish') {
      setInputVal('Machan credit card expire aachu urgently link click panu pay panunga: https://amaz0n-secure-login.xyz');
      return;
    }
    if (presetVariant === 'hinglish') {
      setInputVal('Bhai tera SBI account block ho gaya hai Immediately OTP batana padega call karke');
      return;
    }
    if (presetVariant === 'teluglish') {
      setInputVal('Miku ₹10,00,000 lottery ochindhi e link click chesi payment fee pay cheyandi: bit.ly/claim-prize');
      return;
    }

    if (type === 'url') {
      setInputVal(isOriginal ? 'https://amazon.com' : 'https://amaz0n-secure-login.xyz');
    } else if (type === 'email') {
      setInputVal(isOriginal 
        ? 'From: official-security@amazon.com\nSubject: Order Confirmation #408-12938\n\nDear Customer,\nThank you for shopping on Amazon. Your order has been delivered successfully.'
        : 'From: support@paytm-securityverify.com\nSubject: Verify Your Account Immediately\n\nDear Customer,\nYour Paytm account has been suspended.\nClick below to verify:\nhttps://paytm-securityverify.com/login');
    } else if (type === 'sms') {
      setInputVal(isOriginal
        ? 'Your OTP for SBI Netbanking login is 849201. Valid for 10 minutes. Do not share with anyone.'
        : 'Congratulations!\nYou won ₹10,00,000.\nClaim Now http://bit.ly/claim-prize\nOffer expires today.');
    } else if (type === 'qr') {
      setInputVal(isOriginal
        ? 'Decoded QR URL: https://paytm.com/qr/official-merchant-884'
        : 'Decoded QR URL: https://paytm-payment-security.xyz');
    } else if (type === 'voice') {
      setInputVal(isOriginal
        ? 'Hello, this is automated appointment reminder from AIIMS Hospital for your checkup tomorrow at 10 AM. Press 1 to confirm.'
        : 'Hello Sir,\nYour Aadhaar card is blocked.\nPlease tell your OTP immediately.');
    } else if (type === 'screenshot') {
      setInputVal(isOriginal
        ? 'Official Amazon Home Page Screenshot (amazon_official_homepage.png)'
        : 'Fake Amazon Login Screenshot (amazon_phishing_clone.png)');
    } else if (type === 'domain') {
      setInputVal(isOriginal ? 'google.com' : 'paypal-secure-login.xyz');
    } else if (type === 'payment') {
      setInputVal(isOriginal 
        ? 'Beneficiary VPA: official-amazon@apl\nMerchant Name: Amazon Pay Official\nAmount: ₹1,499.00'
        : 'Beneficiary VPA: paytm-securityverify@ybl\nTarget: Fast Refund Verification Hold\nAmount Requested: ₹5,000.00 Advance Fee');
    } else if (type === 'chat') {
      setChatInput(isOriginal
        ? 'Is https://google.com the official safe website for Google search?'
        : 'Is this SMS safe? Your SBI account is blocked. Click here immediately.');
    }
  };

  const handleScan = async (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() && activeTab !== 'chat') return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await api.post('/scans/analyze', {
        type: activeTab,
        input: inputVal
      });
      setScanResult(res.data);
    } catch (err) {
      console.error('Scan Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setLoading(true);

    try {
      const res = await api.post('/scans/analyze', {
        type: 'chat',
        input: userText
      });
      const aiReply = res.data.response || `${res.data.reasons ? res.data.reasons.join(' ') : 'Scam detected.'}`;
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `${res.data.risk_score > 70 ? '❌ ' : '✅ '}${aiReply}`,
          meta: res.data
        }
      ]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: 'ai', text: 'Error processing chat prompt.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Title Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>MULTI-VECTOR THREAT DETECTION ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100">
          CyberShield AI Scanner Suite
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Select any of the 8 modular AI detectors below or click "Load Demo Preset" to test exact fraud evaluation scenarios.
        </p>
      </div>

      {/* 9 Module Tabs Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 p-2 glass-panel rounded-2xl border border-cyan-500/20">
        {[
          { id: 'url', label: 'URL Scanner', icon: Search },
          { id: 'email', label: 'Email Scanner', icon: Mail },
          { id: 'sms', label: 'SMS Scanner', icon: MessageSquare },
          { id: 'qr', label: 'QR Scanner', icon: QrCode },
          { id: 'voice', label: 'Voice Scam', icon: PhoneCall },
          { id: 'screenshot', label: 'Screenshot OCR', icon: Image },
          { id: 'domain', label: 'Domain Rep', icon: Globe },
          { id: 'payment', label: 'Before You Pay', icon: CreditCard },
          { id: 'chat', label: 'AI Chatbot', icon: Bot }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setScanResult(null);
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border border-cyan-400 text-cyan-300 shadow-neon'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="text-xs font-medium truncate w-full text-center">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Scanner Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Panel (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-cyan-500/30 space-y-6 shadow-2xl">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {activeTab === 'payment' ? <CreditCard className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100 uppercase tracking-tight font-mono">
                    {activeTab === 'payment' ? 'Before You Pay Shield' : `${activeTab} Analysis Module`}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {activeTab === 'payment' ? 'Pre-Payment UPI & Bank Fraud Verification' : 'Input data payload for NLP & ML evaluation'}
                  </p>
                </div>
              </div>

              {/* Demo Preset Buttons */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => loadDemoPreset(activeTab, true)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-mono font-bold flex items-center space-x-1 transition-colors shadow-sm"
                  title="Auto-fill verified original item"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Original</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoPreset(activeTab, false)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-bold flex items-center space-x-1 transition-colors shadow-sm"
                  title="Auto-fill suspicious scam demo preset"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                  <span>Scam</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoPreset(activeTab, false, 'tanglish')}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-300 hover:bg-purple-500/30 text-xs font-mono font-bold flex items-center space-x-1 transition-colors shadow-sm"
                  title="Test Tamil + Tanglish Code-Mixed Scam Text"
                >
                  <Languages className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tanglish</span>
                </button>
                <button
                  type="button"
                  onClick={() => loadDemoPreset(activeTab, false, 'hinglish')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 text-xs font-mono font-bold flex items-center space-x-1 transition-colors shadow-sm"
                  title="Test Hindi + Hinglish Code-Mixed Scam Text"
                >
                  <Languages className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hinglish</span>
                </button>
              </div>
            </div>

            {/* AI CHAT MODULE VIEW */}
            {activeTab === 'chat' ? (
              <div className="space-y-4">
                <div className="h-80 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200'
                            : 'bg-slate-900 border border-slate-800 text-slate-200'
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.meta && (
                          <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-amber-400 space-y-1">
                            <p><strong>Threat Type:</strong> {msg.meta.threat_type}</p>
                            <p><strong>Risk Score:</strong> {msg.meta.risk_score}%</p>
                            <p><strong>Recommendation:</strong> {msg.meta.recommendation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask CyberShield AI (e.g. Is this SBI SMS safe?)..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => loadDemoPreset('chat')}
                    className="px-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono"
                  >
                    Preset
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm shadow-neon hover:bg-cyan-400 transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            ) : (
              /* REGULAR SCANNER INPUT VIEW */
              <form onSubmit={handleScan} className="space-y-6">
                
                {/* File Upload / Image / Audio dragzone if screenshot/qr/voice */}
                {(activeTab === 'screenshot' || activeTab === 'qr' || activeTab === 'voice') && (
                  <div className="p-6 rounded-2xl bg-slate-950/80 border-2 border-dashed border-cyan-500/30 text-center space-y-3 hover:border-cyan-400 transition-colors">
                    <Upload className="w-8 h-8 text-cyan-400 mx-auto animate-bounce-short" />
                    <div>
                      <span className="text-sm font-semibold text-slate-200 block">
                        Upload {activeTab === 'voice' ? 'Audio File (.wav, .mp3)' : 'Image Asset (.png, .jpg)'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Drag and drop or click to browse assets
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => loadDemoPreset(activeTab)}
                      className="text-xs text-cyan-400 font-mono underline block mx-auto"
                    >
                      Or click here to load sample demo file payload
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
                    {activeTab === 'url' || activeTab === 'domain'
                      ? 'Target Website URL / Domain Name'
                      : activeTab === 'email'
                      ? 'Full Email Header & Body Content'
                      : activeTab === 'sms'
                      ? 'SMS Text Message Payload'
                      : 'Input Data / Metadata Payload'}
                  </label>
                  <textarea
                    rows={activeTab === 'email' || activeTab === 'sms' || activeTab === 'voice' ? 5 : 3}
                    required
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-100 text-sm focus:border-cyan-500 outline-none font-mono resize-none"
                    placeholder={`Paste ${activeTab} data to analyze...`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-sm shadow-neon hover:scale-105 transition-transform flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Running AI Pipeline...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-black" />
                        <span>Execute AI Scan</span>
                      </>
                    )}
                  </button>

                  <div className="text-xs font-mono text-slate-400 flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>NLP + Scikit-Learn Engine Active</span>
                  </div>
                </div>

              </form>
            )}

          </div>
        </div>

        {/* Evaluation Output Panel (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          {scanResult ? (
            (() => {
              const isOriginal = scanResult.is_original_item || scanResult.is_original_link || scanResult.isOriginalLink || (scanResult.threat_type && scanResult.threat_type.toLowerCase().includes('original')) || scanResult.risk_score <= 10;
              return (
                <div className={`glass-panel p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl ${
                  isOriginal
                    ? 'border-2 border-emerald-400/80 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                    : 'border border-cyan-500/30'
                }`}>
                  
                  {/* ORIGINAL ITEM BANNER */}
                  {isOriginal && (
                    <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/60 flex items-center space-x-3 text-emerald-300">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/60">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold font-mono tracking-wide text-emerald-300">
                          ✅ VERIFIED ORIGINAL / AUTHENTIC ITEM
                        </h4>
                        <p className="text-xs text-emerald-200/90 font-mono mt-0.5">
                          Authentic, legitimate, and safe official payload
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase">AI EVALUATION OUTPUT</span>
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                      scanResult.risk_score > 70 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : (isOriginal ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/60' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30')
                    }`}>
                      {scanResult.threat_type}
                    </span>
                  </div>

                  {/* Risk Gauge */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono text-slate-400 uppercase">Risk Level</span>
                      <div className={`text-4xl font-extrabold font-mono mt-1 ${scanResult.risk_score > 70 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {scanResult.risk_score}%
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs text-slate-400">
                      <p>Confidence: <strong className="text-cyan-400">{scanResult.confidence}%</strong></p>
                      <p>Analyzed: <span>{scanResult.analyzed_at || 'Just Now'}</span></p>
                    </div>
                  </div>

                  {/* Explainable AI Reasons */}
                  <div>
                    <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
                      Explainable AI (XAI) Reasons:
                    </h4>
                    <div className="space-y-2">
                      {(scanResult.reasons || []).map((r, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-start space-x-2">
                          <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className={`p-4 rounded-xl border ${
                    isOriginal
                      ? 'bg-emerald-950/40 border-emerald-500/50'
                      : 'bg-gradient-to-r from-slate-900 to-slate-950 border-cyan-500/30'
                  }`}>
                    <h5 className="text-xs font-mono text-cyan-400 font-bold uppercase mb-1">Recommendation</h5>
                    <p className="text-xs text-slate-200 font-semibold">{scanResult.recommendation}</p>
                  </div>
                  {/* Export PDF Button */}
                  <button
                    onClick={() => setScanResult(scanResult)}
                    className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm shadow-neon hover:bg-cyan-400 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Open & Download PDF Report</span>
                  </button>

                </div>
              );
            })()
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
              <Shield className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-lg font-bold text-slate-300">Ready for Scan</h4>
              <p className="text-xs text-slate-400">
                Paste suspicious data on the left or click "Load Demo Preset" to initiate real-time AI evaluation pipeline.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* PDF Modal Trigger */}
      {scanResult && (
        <ScanResultModal
          scanResult={scanResult}
          onClose={() => setScanResult(null)}
          user={user}
        />
      )}

    </div>
  );
}
