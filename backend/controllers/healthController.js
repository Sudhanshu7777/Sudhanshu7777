const db = require('../config/database');

const healthCheck = async (req, res) => {
  try {
    // Check database connection
    await db.raw('SELECT 1');
    
    res.status(200).json({
      status: 'OK',
      message: 'EcoSort Assist API is running',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: 'Service unavailable',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    });
  }
};

module.exports = {
  healthCheck
};