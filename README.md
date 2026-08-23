# 🛡️ CyberShield AI – Intelligent Phishing & Scam Fraud Detection System

CyberShield AI is an enterprise-grade autonomous threat intelligence web application designed to evaluate, classify, and neutralize cyber scams across 8 distinct attack vectors (URLs, Email headers, SMS traps, QR codes, Voice vishing calls, Screenshot brand clones, Domain WHOIS reputation, and Interactive AI Counseling).

Built with a dark cyber-security aesthetic, cyan neon glow, glassmorphism UI, real-time WebSocket alert broadcasting, PDF report exports, and an Explainable AI (XAI) engine.

---

## 🌟 Technology Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Framer Motion, Chart.js (`react-chartjs-2`), jsPDF, Socket.io-Client, Lucide Icons
- **Backend API**: Node.js, Express.js, Socket.io, JWT Authentication, bcryptjs, SQL Controller & Query Console
- **AI Microservice Engine**: Python 3.13, FastAPI, Scikit-Learn NLP TF-IDF classifier, Pydantic, Heuristic Rules Engine
- **Relational SQL Database**: SQLite3 Embedded Relational Engine (3NF normalized tables, foreign keys, composite indexes, analytical views) + Mongoose / In-Memory Fallback Adapter
- **Deployment Ready**: Vercel (Client SPA) & Render (Express + FastAPI Microservice)

---

## 📂 Clean Project Directory Architecture

```
coding/
├── client/                      # React Frontend App
│   ├── src/
│   │   ├── components/          # Navbar, Footer, LiveThreatAlerts, ScanResultModal
│   │   ├── pages/               # LandingPage, LoginPage, RegisterPage, OTPVerificationPage,
│   │   │                        # DashboardPage, ScanModulesPage, ScanHistoryPage,
│   │   │                        # IncidentReportPage, LearningHubPage, AdminPanelPage (with SQL Explorer)
│   │   ├── services/            # Axios API & Socket.io client initialization
│   │   ├── utils/               # PDF Report Generator (jsPDF engine)
│   │   ├── App.jsx              # React Router & state manager
│   │   ├── index.css            # Cyber dark glassmorphism design system
│   │   └── main.jsx             # Entry mount
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                      # Express Backend & Socket Server
│   ├── controllers/             # authController, scanController, incidentController, adminController, sqlController
│   ├── middleware/              # JWT verification middleware
│   ├── index.js                 # Server entry point & Socket.io event loop
│   └── package.json
├── python-ai/                   # Python FastAPI AI Microservice Engine
│   └── app.py                   # NLP, Scikit-learn models & Explainable AI logic
├── database/                    # Relational SQL Engine, DDL Schemas, Seed Scripts & Models
│   ├── schema.sql               # 3NF Relational Table Definitions & Analytical Views
│   ├── seed.sql                 # Enterprise Cyber Threat Seed Datasets
│   ├── sqlDb.js                 # SQLite3 Database Service Engine
│   ├── init_sql.js              # CLI Database Management & Diagnostic Utility
│   ├── README_DATABASE.md       # ER Diagram, Indexing Strategy & Migration Guide
│   └── models.js                # Mongoose Fallback ODM Models
└── node-env/                    # Node.js Portable Runtime environment (Windows)
```

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- Python 3.9+ (Python 3.13 installed)
- Node.js 18+ (Node portable v20.18 included in `node-env/`)

### 1. Launch Python AI Microservice Engine
```powershell
# Open Terminal 1
python -m pip install fastapi uvicorn scikit-learn numpy pillow requests pydantic
python python-ai/app.py
# Running on http-[#127.0.0.1:8000]
```

### 2. Launch Node.js Express Backend Server
```powershell
# Open Terminal 2
cd server
..\node-env\npm.cmd install
..\node-env\node.exe index.js
# Running on http-[#127.0.0.1:5000]
```

### 3. Launch React Client Application
```powershell
# Open Terminal 3
cd client
$env:PATH = "c:\Users\snayo\Downloads\coding\node-env;" + $env:PATH
..\node-env\npm.cmd run dev
# Running on http-[#127.0.0.1:3000]
```

---

## 🧪 Demo Presets & Expected Output Verification

Every scanner module in the app contains a **"⚡ Load Demo Preset"** button for instant evaluation:

| Module | Demo Input Preset | Expected Threat Result | Risk Score | Key AI Reasons |
|---|---|---|---|---|
| **1. URL Scanner** | `https://amaz0n-secure-login.xyz` | Phishing Website | **96%** | Fake Amazon Domain, SSL Invalid, 3-Day Old Domain |
| **2. Email Scanner** | `From: support@paytm-securityverify.com` | Phishing Email | **94%** | Fake Sender, Urgent Language, Credential Theft |
| **3. SMS Scanner** | `Congratulations! You won ₹10,00,000...` | Lottery Scam | **98%** | Prize Trap, Bit.ly Link, Urgent Expiry |
| **4. QR Scanner** | `https://paytm-payment-security.xyz` | Fake Payment Website | **95%** | Fake Gateway, High Risk TLD |
| **5. Voice Scam** | `Aadhaar blocked. Tell your OTP...` | Voice Scam / OTP Fraud | **97%** | OTP Pressure, Impersonation |
| **6. Screenshot** | `amazon_phishing_clone.png` | Fake Website Clone | **93%** | Fake Logo, Login Form Collection |
| **7. Domain Rep** | `paypal-secure-login.xyz` | Malicious Domain | **97%** | Domain Age 4 Days, Invalid SSL |
| **8. AI Chat** | `Is this SBI account blocked SMS safe?` | Phishing Attempt | **95%** | Urgency, Fake Banking Link |

---

## 📄 PDF Security Report Feature
Every evaluated threat allows one-click export of an enterprise security audit report generated via `jsPDF` containing:
- Branded CyberShield Header & Status Badge
- Full Metadata & Payload Snapshot
- Explainable AI (XAI) Detection Reasons
- Recommended Action Items
- Digital Verification Signature

---

## 🌐 Deployment Instructions

### Deploy Client to Vercel
1. Set Root Directory to `client`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variable: `VITE_API_URL=https://your-backend.onrender.com`

### Deploy Backend & AI Service to Render
1. Create a Web Service for `server/` (Node.js runtime, Command: `npm start`)
2. Create a Web Service for `python-ai/` (Python runtime, Command: `python app.py`)
3. Connect `PYTHON_AI_URL` environment variable on Node server to the Python service endpoint.

---

## 🔒 Security & Compliance
- Passwords hashed using `bcrypt` (10 rounds)
- Stateless authentication using `JSON Web Tokens (JWT)`
- Emergency Cyber Crime Helpline integration (`1930`)
