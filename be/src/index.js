const express = require('express');
const cors = require('cors');

const unitsRouter = require('./routes/units');
const roomsRouter = require('./routes/rooms');
const bookingsRouter = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/units', unitsRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'iMeeting API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 iMeeting API running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
