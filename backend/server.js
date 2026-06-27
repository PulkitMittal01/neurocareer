// backend/server.js (UPDATED VERSION)
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const quizRoutes = require('./routes/quiz');
const analyzeRoutes = require('./routes/analyze');
const jobRoutes = require('./routes/jobs');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Always allow requests from any Vercel deployment or localhost
    if (origin.includes('vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Fallback to FRONTEND_URL if set
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', quizRoutes);        // /api/quiz
app.use('/api', analyzeRoutes);     // /api/analyze
app.use('/api', jobRoutes);         // /api/jobs
app.use('/api', chatRoutes);        // /api/chat

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Equal Opportunity Career Coach API',
    endpoints: {
      quiz: 'POST /api/quiz',
      analyze: 'POST /api/analyze',
      jobs: 'GET /api/jobs/:roleName',
      chat: 'POST /api/chat',
      health: 'GET /health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log('🚀 Equal Opportunity Career Coach API');
  console.log(`${'='.repeat(50)}`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints available`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`${'='.repeat(50)}\n`);
});

module.exports = app;