const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all units
router.get('/', (req, res) => {
  try {
    const units = db.prepare('SELECT * FROM units ORDER BY name').all();
    res.json({ success: true, data: units });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
