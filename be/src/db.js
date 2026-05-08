const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'imeeting.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS units (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    tanggal_rapat TEXT NOT NULL,
    waktu_mulai TEXT NOT NULL,
    waktu_selesai TEXT NOT NULL,
    jumlah_peserta INTEGER NOT NULL,
    jenis_konsumsi TEXT,
    nominal_konsumsi REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (unit_id) REFERENCES units(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
  );
`);

// Seed data only if tables are empty
const unitCount = db.prepare('SELECT COUNT(*) as count FROM units').get();
if (unitCount.count === 0) {
  const insertUnit = db.prepare('INSERT INTO units (name) VALUES (?)');
  const insertRoom = db.prepare('INSERT INTO rooms (name, capacity) VALUES (?, ?)');

  const units = [
    { name: 'UNIT KEUANGAN' },
    { name: 'UNIT SDM' },
    { name: 'UNIT IT' },
    { name: 'UNIT OPERASIONAL' },
  ];

  // Global rooms — available for all units
  const rooms = [
    { name: 'Ruang A', capacity: 6 },
    { name: 'Ruang B', capacity: 10 },
    { name: 'Ruang C', capacity: 15 },
    { name: 'Ruang D', capacity: 20 },
    { name: 'Ruang E', capacity: 30 },
    { name: 'Ruang F', capacity: 50 },
  ];

  const unitIds = [];
  for (const unit of units) {
    const result = insertUnit.run(unit.name);
    unitIds.push(result.lastInsertRowid);
  }

  const roomIds = [];
  for (const room of rooms) {
    const result = insertRoom.run(room.name, room.capacity);
    roomIds.push(result.lastInsertRowid);
  }

  // Seed some sample bookings
  const insertBooking = db.prepare(`
    INSERT INTO bookings (unit_id, room_id, tanggal_rapat, waktu_mulai, waktu_selesai, jumlah_peserta, jenis_konsumsi, nominal_konsumsi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBooking.run(unitIds[0], roomIds[0], '2024-12-11', '11:00', '13:00', 5, 'Snack Siang,Makan Siang', 500000);
  insertBooking.run(unitIds[1], roomIds[2], '2024-12-11', '11:00', '13:00', 12, 'Snack Sore', 150000);
  insertBooking.run(unitIds[2], roomIds[4], '2024-12-12', '09:00', '11:00', 25, 'Snack Siang', 200000);
  insertBooking.run(unitIds[3], roomIds[1], '2024-12-13', '13:00', '15:00', 8, 'Makan Siang,Snack Sore', 750000);

  console.log('✅ Database seeded successfully');
}

module.exports = db;
