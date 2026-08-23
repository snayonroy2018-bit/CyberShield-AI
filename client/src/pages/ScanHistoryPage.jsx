import React, { useEffect, useState } from 'react';
import { Clock, Download, Search, Filter, ShieldAlert, CheckCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { generatePDFReport } from '../utils/pdfGenerator';
import ScanResultModal from '../components/ScanResultModal';

export default function ScanHistoryPage({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/scans/history');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => 
    (item.input || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.scanType || item.scan_type || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.threatType || item.threat_type || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 flex items-center space-x-3">
            <Clock className="w-8 h-8 text-cyan-400" />
            <span>AI Threat Scan History</span>
          </h1>
          <p className="text-sm text-slate-400 font-mono mt-1">
            Complete audit trail of evaluated URLs, Emails, SMS, Voice calls, and QR codes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono focus:border-cyan-500 outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 font-mono text-cyan-400">Loading scan history log...</div>
      ) : (
        <div className="glass-panel rounded-3xl border border-cyan-500/20 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-xs font-mono text-cyan-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Scan Type</th>
                  <th className="py-4 px-6">Payload Content</th>
                  <th className="py-4 px-6">Threat Type</th>
                  <th className="py-4 px-6">Risk Score</th>
                  <th className="py-4 px-6 text-right">PDF Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
                {filteredHistory.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setSelectedScan(item)}
                    className="hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-6 text-slate-400 whitespace-nowrap">
                      {item.date ? new Date(item.date).toLocaleString() : 'Recent'}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-200">
                      {item.scanType || item.scan_type}
                    </td>
                    <td className="py-4 px-6 text-slate-400 max-w-[260px] truncate">
                      {item.input}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded text-[11px] font-bold ${item.riskScore > 70 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {item.threatType || item.threat_type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-base">
                      <span className={item.riskScore > 70 ? 'text-red-400' : 'text-emerald-400'}>
                        {item.riskScore || item.risk_score}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generatePDFReport(item, user ? user.username : 'CyberShield User');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-black text-cyan-300 transition-colors inline-flex items-center space-x-1 font-bold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedScan && (
        <ScanResultModal
          scanResult={selectedScan}
          onClose={() => setSelectedScan(null)}
          user={user}
        />
      )}

    </div>
  );
}
