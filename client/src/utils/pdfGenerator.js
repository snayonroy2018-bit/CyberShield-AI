/**
 * CyberShield AI - PDF Security Report Generator
 * Generates enterprise-ready cyber threat PDF audit reports using jsPDF.
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDFReport = (scanData, username = 'CyberShield User') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Dark Cyber Header Background
  doc.setFillColor(9, 13, 22);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Title Banner
  doc.setTextColor(0, 240, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CYBERSHIELD AI', 14, 22);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Intelligent Phishing & Scam Fraud Detection Report', 14, 30);

  // Security Status Badge in Header
  const risk = scanData.risk_score || scanData.riskScore || 0;
  const isOriginal = scanData.is_original_link || scanData.isOriginalLink || scanData.threat_type === 'Verified Original Website';
  let statusBg = [16, 185, 129]; // Green
  let statusText = isOriginal ? 'VERIFIED ORIGINAL LINK' : 'SAFE';

  if (risk > 70) {
    statusBg = [239, 68, 68]; // Red
    statusText = 'HIGH RISK THREAT';
  } else if (risk > 40) {
    statusBg = [245, 158, 11]; // Yellow
    statusText = 'SUSPICIOUS';
  }

  doc.setFillColor(...statusBg);
  doc.roundedRect(pageWidth - 65, 12, 50, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(statusText, pageWidth - 40, 22, { align: 'center' });

  // Metadata Table
  let currentY = 50;

  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Threat Audit Summary', 14, currentY);

  currentY += 6;

  const lang = scanData.multilingual_analysis || {};
  const intent = scanData.scam_intent || {};
  const chain = scanData.scam_chain || {};
  const nextStep = scanData.next_step_prediction || {};
  const soc = scanData.social_engineering || {};
  const pay = scanData.before_you_pay_protection || {};

  const metadataRows = [
    ['User Account:', username],
    ['Report ID:', `CS-RPT-${Math.floor(100000 + Math.random() * 900000)}`],
    ['Audit Date:', scanData.analyzed_at || new Date().toLocaleString()],
    ['Module Evaluated:', scanData.scan_type || scanData.scanType || 'Scanner'],
    ['Input Evaluated:', (scanData.input || '').substring(0, 65)],
    ['Identified Threat:', scanData.threat_type || scanData.threatType || 'N/A'],
    ['AI Risk Score:', `${risk}% / 100% (${risk > 70 ? 'Phishing/Scam' : risk > 40 ? 'Suspicious' : 'Safe'})`],
    ['Languages & Script:', `${(lang.detected_languages || ['English']).join(', ')} (${lang.code_mixed_script || 'Standard'})`],
    ['Scam Intent:', `${intent.primary_intent || 'Financial Fraud'} [${intent.severity || 'High'}]`],
    ['Scam Chain Stage:', chain.current_stage || 'Stage 1: Initial Hook'],
    ['Next Step Forecast:', (nextStep.predicted_action || 'Demand OTP or payment').substring(0, 70)],
    ['Psychological Tactic:', soc.dominant_tactic || 'Urgency & Time Pressure'],
    ['Before You Pay Shield:', scanData.payment_verdict || pay.verdict || (risk > 70 ? 'DO NOT PAY' : 'SAFE')]
  ];

  doc.autoTable({
    startY: currentY,
    head: [['Threat Intelligence Attribute', 'Evaluation Details']],
    body: metadataRows,
    theme: 'grid',
    headStyles: { fillStyle: 'F', fillColor: [15, 23, 42], textColor: [0, 240, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 12;

  // Explainable AI Findings Section
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Explainable AI (XAI) Detection Reasons', 14, currentY);

  currentY += 6;

  const reasons = scanData.reasons || [];
  const reasonRows = reasons.map((r, idx) => [`${idx + 1}`, r]);

  doc.autoTable({
    startY: currentY,
    head: ['#', 'Detected Suspicious Vector / Trigger'],
    body: reasonRows.length > 0 ? reasonRows : [['1', 'No anomalies identified. Input matches standard safe patterns.']],
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255] },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 12;

  // AI Security Recommendations
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Recommended Action Steps', 14, currentY);

  currentY += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Primary Advice: ${scanData.recommendation || 'Proceed with caution.'}`, 14, currentY);

  currentY += 8;

  const actions = scanData.action_items || scanData.actionItems || ['Report Scam', 'Block Sender'];
  actions.forEach((act) => {
    doc.text(`  • ${act}`, 14, currentY);
    currentY += 6;
  });

  // Footer Verification Signature
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 275, pageWidth - 14, 275);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('CyberShield AI Threat Engine - Powered by NLP & Scikit-Learn Heuristic Models.', 14, 282);
  doc.text('Confidential Security Report. Generated for official incident response.', pageWidth - 14, 282, { align: 'right' });

  // Save PDF Download
  const filename = `CyberShield_Report_${(scanData.threat_type || 'Scan').replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(filename);
};
