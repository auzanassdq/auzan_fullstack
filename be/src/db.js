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
    unit_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES units(id)
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
  const insertRoom = db.prepare('INSERT INTO rooms (unit_id, name, capacity) VALUES (?, ?, ?)');

  const units = [
    { name: 'UNIT KEUANGAN' },
    { name: 'UNIT SDM' },
    { name: 'UNIT IT' },
    { name: 'UNIT OPERASIONAL' },
  ];

  const rooms = [
    { unitIndex: 0, name: 'Ruang Prambanan', capacity: 10 },
    { unitIndex: 0, name: 'Ruang Borobudur', capacity: 20 },
    { unitIndex: 1, name: 'Ruang Prambanan', capacity: 10 },
    { unitIndex: 1, name: 'Ruang Dieng', capacity: 15 },
    { unitIndex: 2, name: 'Ruang Bromo', capacity: 8 },
    { unitIndex: 2, name: 'Ruang Borobudur', capacity: 20 },
    { unitIndex: 3, name: 'Ruang Dieng', capacity: 15 },
    { unitIndex: 3, name: 'Ruang Prambanan', capacity: 10 },
  ];

  const unitIds = [];
  for (const unit of units) {
    const result = insertUnit.run(unit.name);
    unitIds.push(result.lastInsertRowid);
  }

  for (const room of rooms) {
    insertRoom.run(unitIds[room.unitIndex], room.name, room.capacity);
  }

  // Seed some sample bookings
  const insertBooking = db.prepare(`
    INSERT INTO bookings (unit_id, room_id, tanggal_rapat, waktu_mulai, waktu_selesai, jumlah_peserta, jenis_konsumsi, nominal_konsumsi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertBooking.run(unitIds[0], 1, '2024-12-11', '11:00', '13:00', 8, 'Snack Siang,Makan Siang', 500000);
  insertBooking.run(unitIds[1], 3, '2024-12-11', '11:00', '13:00', 3, 'Snack Sore', 150000);
  insertBooking.run(unitIds[2], 5, '2024-12-12', '09:00', '11:00', 5, 'Snack Siang', 200000);
  insertBooking.run(unitIds[3], 7, '2024-12-13', '13:00', '15:00', 10, 'Makan Siang,Snack Sore', 750000);

  console.log('✅ Database seeded successfully');
}

module.exports = db;
