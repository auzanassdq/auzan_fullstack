# iMeeting — Sistem Peminjaman Ruang Meeting

<p align="center">
  <img src="./Logo-FTL-no-tagline 1.png" alt="FTL Logo" height="60" />
</p>

<p align="center">
  Aplikasi fullstack untuk manajemen dan peminjaman ruang meeting.
</p>

---

## 📋 Fitur Utama

- **Daftar Peminjaman** — Tampilan tabel semua booking ruang meeting dengan pagination
- **Pesan Ruangan** — Form peminjaman dengan validasi lengkap
- **Auto-fill Kapasitas** — Kapasitas ruangan terisi otomatis saat ruangan dipilih
- **Filter Ruangan per Unit** — Dropdown ruangan berubah sesuai unit yang dipilih
- **Jenis Konsumsi** — Pilihan Snack Siang, Makan Siang, Snack Sore (checkbox)
- **Hapus Booking** — Tombol hapus langsung di tabel
- **Data Seed Otomatis** — Database ter-seed otomatis saat pertama kali dijalankan

---

## 🗂️ Struktur Project

```
FTL/
├── fe/                         # Frontend — React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── assets/             # Logo FTL & avatar user
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Header dengan logo & user profile
│   │   │   ├── Sidebar.jsx     # Sidebar navigasi
│   │   │   └── Icons.jsx       # Kumpulan SVG icon
│   │   ├── pages/
│   │   │   ├── BookingList.jsx # Halaman daftar peminjaman
│   │   │   ├── BookingForm.jsx # Form pesan ruangan
│   │   │   └── Profile.jsx     # Halaman profil user
│   │   ├── services/
│   │   │   └── api.js          # Service layer HTTP ke backend
│   │   ├── App.jsx             # Root component + routing
│   │   ├── main.jsx            # Entry point React
│   │   └── index.css           # Global styles + Tailwind
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── be/                         # Backend — Express + SQLite
│   ├── src/
│   │   ├── routes/
│   │   │   ├── units.js        # GET /api/units
│   │   │   ├── rooms.js        # GET /api/rooms, GET /api/rooms/:id
│   │   │   └── bookings.js     # GET/POST/DELETE /api/bookings
│   │   ├── db.js               # SQLite setup & seed data
│   │   └── index.js            # Express entry point
│   ├── imeeting.db             # File database SQLite (auto-generated)
│   └── package.json
│
├── Ellipse 1.png               # Gambar avatar user
├── Logo-FTL-no-tagline 1.png   # Logo FTL
└── README.md
```

---

## 🛠️ Tech Stack

| Layer      | Teknologi                                      |
|------------|------------------------------------------------|
| Frontend   | React 19, Vite 8, Tailwind CSS 4, React Router |
| Backend    | Node.js, Express 5, better-sqlite3             |
| Database   | SQLite (file-based, zero-config)               |
| Font       | Inter (Google Fonts)                           |

---

## 🚀 Cara Menjalankan

### Prasyarat

- Node.js **v18+**
- npm **v9+**

---

### 1. Backend

```bash
cd be
npm install
npm start
```

Server berjalan di **http://localhost:3001**

> Saat pertama kali dijalankan, database SQLite (`imeeting.db`) akan dibuat otomatis beserta data awal (units, rooms, dan sample bookings).

---

### 2. Frontend

Buka terminal baru:

```bash
cd fe
npm install
npm run dev
```

Aplikasi tersedia di **http://localhost:5173**

---

## 🗄️ Skema Database

### Tabel `units`
| Kolom | Tipe    | Keterangan     |
|-------|---------|----------------|
| id    | INTEGER | Primary key    |
| name  | TEXT    | Nama unit      |

### Tabel `rooms`
| Kolom    | Tipe    | Keterangan                    |
|----------|---------|-------------------------------|
| id       | INTEGER | Primary key                   |
| unit_id  | INTEGER | Foreign key → units.id        |
| name     | TEXT    | Nama ruangan                  |
| capacity | INTEGER | Kapasitas (jumlah orang)      |

### Tabel `bookings`
| Kolom            | Tipe    | Keterangan                              |
|------------------|---------|-----------------------------------------|
| id               | INTEGER | Primary key                             |
| unit_id          | INTEGER | Foreign key → units.id                  |
| room_id          | INTEGER | Foreign key → rooms.id                  |
| tanggal_rapat    | TEXT    | Format: YYYY-MM-DD                      |
| waktu_mulai      | TEXT    | Contoh: `09:00`                         |
| waktu_selesai    | TEXT    | Contoh: `11:00`                         |
| jumlah_peserta   | INTEGER | Jumlah peserta rapat                    |
| jenis_konsumsi   | TEXT    | Comma-separated: `Snack Siang,Makan Siang` |
| nominal_konsumsi | REAL    | Nominal biaya konsumsi                  |
| created_at       | TEXT    | Waktu booking dibuat                    |

---

## 🌐 API Endpoints

### Units
| Method | Endpoint     | Keterangan         |
|--------|--------------|--------------------|
| GET    | `/api/units` | Daftar semua unit  |

### Rooms
| Method | Endpoint              | Keterangan                              |
|--------|-----------------------|-----------------------------------------|
| GET    | `/api/rooms`          | Semua ruangan (opsional: `?unit_id=1`)  |
| GET    | `/api/rooms/:id`      | Detail satu ruangan                     |

### Bookings
| Method | Endpoint              | Keterangan                                  |
|--------|-----------------------|---------------------------------------------|
| GET    | `/api/bookings`       | Daftar booking (opsional: `?page=1&limit=10`) |
| GET    | `/api/bookings/:id`   | Detail satu booking                         |
| POST   | `/api/bookings`       | Buat booking baru                           |
| DELETE | `/api/bookings/:id`   | Hapus booking                               |

#### Contoh Request Body — POST `/api/bookings`

```json
{
  "unit_id": 1,
  "room_id": 2,
  "tanggal_rapat": "2024-12-20",
  "waktu_mulai": "09:00",
  "waktu_selesai": "11:00",
  "jumlah_peserta": 8,
  "jenis_konsumsi": "Snack Siang,Makan Siang",
  "nominal_konsumsi": 500000
}
```

---

## 📦 Data Seed Awal

Unit yang tersedia:
- **UNIT KEUANGAN** — Ruang Prambanan (10), Ruang Borobudur (20)
- **UNIT SDM** — Ruang Prambanan (10), Ruang Dieng (15)
- **UNIT IT** — Ruang Bromo (8), Ruang Borobudur (20)
- **UNIT OPERASIONAL** — Ruang Dieng (15), Ruang Prambanan (10)