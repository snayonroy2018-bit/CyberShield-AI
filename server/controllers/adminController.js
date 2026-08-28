/**
 * CyberShield AI - Admin Controller
 */

const { getStoredUsers, getStoredUserLogs } = require('./authController');

exports.getAdminMetrics = async (req, res) => {
  try {
    const users = await getStoredUsers();
    const userLogs = await getStoredUserLogs();

    const activeAdminName = req.user?.username || 'System Administrator';

    res.json({
      adminName: activeAdminName,
      systemHealth: '100% Operational',
      aiEngineStatus: 'Active (FastAPI NLP + Scikit-Learn Pipeline)',
      totalRegisteredUsers: users.length,
      activeThreatFeeds: 18,
      globalScansToday: 412,
      threatDetectionRate: '98.4%',
      serverUptime: '99.98%',
      registeredUsers: users,
      userLogs: userLogs,
      systemLogs: [
        { id: 1, type: 'SECURITY', message: `Admin ${activeAdminName} authenticated successfully`, time: 'Just now' },
        { id: 2, type: 'ALERT', message: 'High risk phishing campaign detected (amaz0n-secure-login.xyz)', time: '10 mins ago' },
        { id: 3, type: 'INFO', message: 'Threat Intelligence Blacklist feeds updated successfully', time: '45 mins ago' },
        { id: 4, type: 'SUCCESS', message: 'Python NLP Model weights auto-calibrated', time: '2 hours ago' }
      ]
    });
  } catch (err) {
    console.error('Admin Metrics Error:', err);
    res.status(500).json({ msg: 'Failed to retrieve admin metrics.' });
  }
};

exports.getRegisteredUsers = async (req, res) => {
  try {
    const users = await getStoredUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch registered users.' });
  }
};

exports.getUserLogs = async (req, res) => {
  try {
    const logs = await getStoredUserLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch user login logs.' });
  }
};
