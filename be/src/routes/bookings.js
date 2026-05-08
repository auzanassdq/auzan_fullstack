const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all bookings with pagination
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const total = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;

    const bookings = db.prepare(`
      SELECT 
        b.id,
        u.name as unit,
        r.name as ruang_meeting,
        r.capacity as kapasitas,
        b.tanggal_rapat,
        b.waktu_mulai,
        b.waktu_selesai,
        b.jumlah_peserta,
        b.jenis_konsumsi,
        b.nominal_konsumsi,
        b.created_at
      FROM bookings b
      JOIN units u ON b.unit_id = u.id
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.id DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single booking
router.get('/:id', (req, res) => {
  try {
    const booking = db.prepare(`
      SELECT 
        b.*,
        u.name as unit,
        r.name as ruang_meeting,
        r.capacity as kapasitas
      FROM bookings b
      JOIN units u ON b.unit_id = u.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `).get(req.params.id);

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create booking
router.post('/', (req, res) => {
  try {
    const {
      unit_id,
      room_id,
      tanggal_rapat,
      waktu_mulai,
      waktu_selesai,
      jumlah_peserta,
      jenis_konsumsi,
      nominal_konsumsi,
    } = req.body;

    if (!unit_id || !room_id || !tanggal_rapat || !waktu_mulai || !waktu_selesai || !jumlah_peserta) {
      return res.status(400).json({ success: false, message: 'Semua field wajib diisi' });
    }

    const result = db.prepare(`
      INSERT INTO bookings (unit_id, room_id, tanggal_rapat, waktu_mulai, waktu_selesai, jumlah_peserta, jenis_konsumsi, nominal_konsumsi)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(unit_id, room_id, tanggal_rapat, waktu_mulai, waktu_selesai, jumlah_peserta, jenis_konsumsi || '', nominal_konsumsi || 0);

    const booking = db.prepare(`
      SELECT b.*, u.name as unit, r.name as ruang_meeting, r.capacity as kapasitas
      FROM bookings b
      JOIN units u ON b.unit_id = u.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ success: true, data: booking, message: 'Booking berhasil disimpan' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE booking
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
