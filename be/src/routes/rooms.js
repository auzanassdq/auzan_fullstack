const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all rooms (optional filter by unit_id)
router.get('/', (req, res) => {
  try {
    const { unit_id } = req.query;
    let rooms;
    if (unit_id) {
      rooms = db.prepare('SELECT * FROM rooms WHERE unit_id = ? ORDER BY name').all(unit_id);
    } else {
      rooms = db.prepare('SELECT r.*, u.name as unit_name FROM rooms r JOIN units u ON r.unit_id = u.id ORDER BY r.name').all();
    }
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
