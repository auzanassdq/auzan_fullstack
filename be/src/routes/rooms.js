const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all rooms — global, no unit filter needed
router.get('/', (req, res) => {
  try {
    const rooms = db.prepare('SELECT * FROM rooms ORDER BY name').all();
    res.json({ success: true, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single room by id
router.get('/:id', (req, res) => {
  try {
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });
    res.json({ success: true, data: room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
