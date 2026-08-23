/**
 * CyberShield AI - Incident Reporting Controller
 */

const { Incident } = require('../../database/models');
const sqlDb = require('../../database/sqlDb');

const inMemoryIncidents = [
  {
    ticketId: 'CS-90124',
    userId: 'usr_demo',
    username: 'Demo User',
    title: 'Phishing SMS received from fake bank',
    category: 'UPI / Banking Fraud',
    targetUrlOrPhone: '+91 98765 43210',
    lossAmount: 0,
    status: 'Under Investigation',
    severity: 'High',
    description: 'Received SMS stating SBI account will be blocked within 2 hours if OTP is not provided.',
    submittedAt: new Date(Date.now() - 3600 * 1000 * 24)
  }
];

exports.submitIncident = async (req, res) => {
  try {
    const { title, category, description, targetUrlOrPhone, lossAmount } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ msg: 'Title, category, and incident description are required.' });
    }

    const ticketId = 'CS-' + Math.floor(10000 + Math.random() * 90000);
    const incidentData = {
      ticketId,
      userId: req.user ? req.user.id : 'anonymous',
      username: req.user ? req.user.username : 'Victim User',
      title,
      category,
      description,
      targetUrlOrPhone: targetUrlOrPhone || 'N/A',
      lossAmount: lossAmount || 0,
      status: 'Under Investigation',
      severity: (lossAmount || 0) > 10000 ? 'Critical' : 'High',
      submittedAt: new Date()
    };

    try {
      const incObj = new Incident(incidentData);
      await incObj.save();
    } catch (dbErr) {
      inMemoryIncidents.unshift(incidentData);
    }

    // Persist to Relational SQL Database
    try {
      const incId = 'inc_' + Date.now();
      await sqlDb.run(
        `INSERT INTO incidents (id, ticket_id, user_id, username, title, category, description, target_url_or_phone, loss_amount, status, severity, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        [
          incId,
          ticketId,
          incidentData.userId,
          incidentData.username,
          incidentData.title,
          incidentData.category,
          incidentData.description,
          incidentData.targetUrlOrPhone,
          incidentData.lossAmount,
          incidentData.status,
          incidentData.severity
        ]
      );
    } catch (sqlErr) {
      console.error('SQL Incident Save Warning:', sqlErr.message);
    }

    res.json({
      success: true,
      ticketId,
      msg: 'Incident reported successfully to CyberShield AI Security Response Team.',
      incident: incidentData
    });
  } catch (err) {
    res.status(500).json({ msg: 'Incident submission failed.' });
  }
};

exports.getIncidents = async (req, res) => {
  try {
    let list = [];
    try {
      const sqlIncidents = await sqlDb.query('SELECT * FROM incidents ORDER BY submitted_at DESC');
      if (sqlIncidents && sqlIncidents.length > 0) {
        list = sqlIncidents.map(i => ({
          ticketId: i.ticket_id,
          userId: i.user_id,
          username: i.username,
          title: i.title,
          category: i.category,
          description: i.description,
          targetUrlOrPhone: i.target_url_or_phone,
          lossAmount: i.loss_amount,
          status: i.status,
          severity: i.severity,
          submittedAt: i.submitted_at
        }));
      }
    } catch (sqlErr) {
      console.error('SQL Incidents Fetch Error:', sqlErr.message);
    }

    if (list.length === 0) {
      try {
        list = await Incident.find().sort({ submittedAt: -1 });
      } catch (dbErr) {
        list = [...inMemoryIncidents];
      }
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to retrieve incident reports.' });
  }
};
