const express = require('express');
const cors = require('cors');
require('dotenv').config();

const leadRoutes = require('./routes/leadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger (simple)
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Lead Management API is running',
    endpoints: {
      'GET /api/leads': 'List all leads (supports ?search, ?status, ?source)',
      'GET /api/leads/stats': 'Dashboard statistics',
      'POST /api/leads': 'Add a new lead',
      'PATCH /api/leads/:id/status': 'Update lead status',
      'DELETE /api/leads/:id': 'Delete a lead',
    },
  });
});

// API routes
app.use('/api/leads', leadRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
