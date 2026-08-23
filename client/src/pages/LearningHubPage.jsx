import React, { useState } from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, XCircle, HelpCircle, Award } from 'lucide-react';

export default function LearningHubPage() {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = [
    {
      question: "Which domain is legitimate for Amazon Customer Service?",
      options: [
        "https://amaz0n-secure-login.xyz",
        "https://amazon.com",
        "http://amazon-verify-account.info",
        "https://paytm-amazon-offer.site"
      ],
      answer: 1,
      explanation: "Official brand domains end with their canonical root name (e.g. amazon.com or amazon.in). Beware of typos (amaz0n with zero) or suspicious TLD extensions (.xyz, .info)."
    },
    {
      question: "Your bank sends an SMS: 'Account blocked! Click here to update OTP immediately.' What should you do?",
      options: [
        "Click the link immediately to prevent account suspension",
        "Reply with your 6-digit OTP code",
        "Delete the SMS and contact your bank official helpline directly",
        "Forward the SMS to all your family members"
      ],
      answer: 2,
      explanation: "Banks will NEVER send third-party links or demand confidential OTP codes over SMS. This is classic social engineering panic inducement."
    },
    {
      question: "What is 'Vishing'?",
      options: [
        "Phishing conducted via voice calls (e.g. fake police/bank calls asking for OTP)",
        "Scanning QR codes at restaurants",
        "Using a VPN to browse anonymously",
        "Sending spam emails with PDF attachments"
      ],
      answer: 0,
      explanation: "Vishing (Voice Phishing) uses phone calls to impersonate authority figures (Cyber Crime officers, Bank Managers, TRAI) to extort OTPs or money transfers."
    }
  ];

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === quizQuestions[currentQuiz].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuiz < quizQuestions.length - 1) {
      setCurrentQuiz((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-12 pb-16">
      
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <BookOpen className="w-4 h-4" />
          <span>CYBER AWARENESS & EDUCATION HUB</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100">
          Phishing & Scam Learning Hub
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Test your fraud awareness skills with our interactive cybersecurity quiz and reference guide.
        </p>
      </div>

      {/* Interactive Quiz Section */}
      <div className="max-w-3xl mx-auto glass-panel p-8 rounded-3xl border border-cyan-500/30 space-y-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 font-mono text-xs text-cyan-400">
          <span>INTERACTIVE PHISHING QUIZ</span>
          <span>Question {currentQuiz + 1} of {quizQuestions.length}</span>
        </div>

        {quizFinished ? (
          <div className="text-center py-8 space-y-6">
            <Award className="w-16 h-16 text-cyan-400 mx-auto animate-bounce-short" />
            <h2 className="text-3xl font-extrabold text-slate-100">Quiz Completed!</h2>
            <div className="text-2xl font-mono text-cyan-300">
              Your Score: <strong className="text-emerald-400">{score}</strong> / {quizQuestions.length}
            </div>
            <p className="text-sm text-slate-300">
              {score === quizQuestions.length ? '🌟 Perfect Score! You are a Cyber Security Specialist.' : 'Good effort! Review the security dictionary below.'}
            </p>
            <button
              onClick={resetQuiz}
              className="px-8 py-3 rounded-xl bg-cyan-500 text-black font-bold text-sm shadow-neon"
            >
              Retake Cyber Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-100">
              {quizQuestions[currentQuiz].question}
            </h3>

            <div className="space-y-3">
              {quizQuestions[currentQuiz].options.map((opt, idx) => {
                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/50';
                if (selectedOption !== null) {
                  if (idx === quizQuestions[currentQuiz].answer) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                  }
                }
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-sm font-mono transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-slate-300 space-y-2">
                <span className="text-cyan-400 font-bold font-mono">EXPLANATION:</span>
                <p>{quizQuestions[currentQuiz].explanation}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs shadow-neon"
                  >
                    Next Question →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Scam Types Dictionary */}
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 text-center font-mono">
          Common Scam Attack Surfaces
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-cyan-400 font-mono">Phishing URLs</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spoofed domain names designed to visually mimic banking or e-commerce login portals to harvest credentials.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-purple-400 font-mono">Lottery & Reward Traps</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unsolicited prize claims asking victims to pay "processing fees" or enter banking details via shortened bit.ly URLs.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-red-400 font-mono">Vishing (Voice Fraud)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Phone scams impersonating police, Aadhaar authorities, or bank staff coercing callers into revealing One-Time Passwords.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
