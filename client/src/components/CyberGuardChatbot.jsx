import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, ShieldAlert, Sparkles, Shield, ChevronDown, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';
import { api } from '../services/api';

export default function CyberGuardChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: '👋 Hello! I am CyberShield AI Assistant. Ask me any security question, paste a link/SMS to check, or ask how to report a fraud!',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    '🔍 Is google.com safe?',
    '🚨 How to report fraud?',
    '📞 Received suspicious SBI block SMS',
    '🛡️ What is CyberShield AI?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/scans/analyze', {
        type: 'chat',
        input: queryText
      });

      const data = res.data;
      const responseText = data.response || 'I evaluated your security prompt against CyberShield AI threat feeds.';

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        meta: data,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: '⚠️ Unable to connect to CyberShield AI Threat Engine. Please check backend server status.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center space-x-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-black font-bold text-sm shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:scale-105 transition-all duration-300 border border-cyan-300"
        >
          <div className="relative">
            <Bot className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-200"></span>
            </span>
          </div>
          <span className="font-mono text-xs tracking-wide uppercase">Ask CyberShield AI</span>
        </button>
      )}

      {/* Floating Chatbot Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-96 h-[540px] glass-panel rounded-3xl border border-cyan-500/40 shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-[#0a101f] to-slate-900 border-b border-cyan-500/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-neon border border-cyan-400/40">
                <Bot className="w-6 h-6 text-black stroke-[2.5]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-100 flex items-center space-x-1.5 font-mono">
                  <span>CyberShield AI Assistant</span>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h3>
                <p className="text-[10px] text-cyan-300 font-mono">ONLINE • REAL-TIME THREAT COUNSELING</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center space-x-1.5 overflow-x-auto text-[11px] font-mono no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/20 transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs bg-slate-950/40">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-100 rounded-br-none shadow-sm'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-md space-y-2'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                  {/* AI Metadata Card (if present) */}
                  {msg.meta && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 space-y-2 text-[11px]">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-cyan-400">{msg.meta.threat_type || 'Security Threat Assessment'}</span>
                        <span
                          className={`px-2 py-0.5 rounded ${
                            (msg.meta.risk_score || 0) > 70
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          Risk: {msg.meta.risk_score || 0}%
                        </span>
                      </div>

                      {msg.meta.reasons && msg.meta.reasons.length > 0 && (
                        <div className="space-y-1 text-slate-300">
                          {msg.meta.reasons.map((reason, rIdx) => (
                            <div key={rIdx} className="flex items-start space-x-1.5">
                              <span className="text-cyan-400">•</span>
                              <span>{reason}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.meta.recommendation && (
                        <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 font-semibold">
                          💡 {msg.meta.recommendation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-cyan-400 text-xs p-2 bg-slate-900/60 rounded-xl border border-cyan-500/20 w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>CyberShield AI is analyzing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CyberShield AI a security question..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:border-cyan-500 outline-none font-mono"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-cyan-500 text-black font-bold disabled:opacity-50 hover:bg-cyan-400 transition-colors shadow-neon"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
}
