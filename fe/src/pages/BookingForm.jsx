import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ChevronLeftIcon, CalendarIcon } from "../components/Icons";
import { ToastContainer, useToast } from "../components/Toast";

const WAKTU_OPTIONS = [
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const KONSUMSI_OPTIONS = ["Snack Siang", "Makan Siang", "Snack Sore"];

const initialForm = {
  unit_id: "",
  room_id: "",
  tanggal_rapat: "",
  waktu_mulai: "",
  waktu_selesai: "",
  jumlah_peserta: "",
  jenis_konsumsi: [],
  nominal_konsumsi: "",
};

export default function BookingForm() {
  const navigate = useNavigate();
  const { toasts, removeToast, toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [units, setUnits] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [kapasitas, setKapasitas] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Load units on mount
  useEffect(() => {
    api
      .getUnits()
      .then((res) => setUnits(res.data))
      .catch(() => setUnits([]));
  }, []);

  // Load rooms on mount
  useEffect(() => {
    setLoading(true);
    api
      .getRooms()
      .then((res) => setRooms(res.data))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false));
  }, []);

  // Auto-fill kapasitas when room changes
  useEffect(() => {
    if (!form.room_id) {
      setKapasitas("");
      return;
    }
    const room = rooms.find((r) => String(r.id) === String(form.room_id));
    setKapasitas(room ? `${room.capacity} Orang` : "");
  }, [form.room_id, rooms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: null }));
  };

  const handleKonsumsiChange = (val) => {
    setForm((f) => ({
      ...f,
      jenis_konsumsi: f.jenis_konsumsi.includes(val)
        ? f.jenis_konsumsi.filter((k) => k !== val)
        : [...f.jenis_konsumsi, val],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.unit_id) e.unit_id = "Pilih unit";
    if (!form.room_id) e.room_id = "Pilih ruangan";
    if (!form.tanggal_rapat) e.tanggal_rapat = "Pilih tanggal rapat";
    if (!form.waktu_mulai) e.waktu_mulai = "Pilih waktu mulai";
    if (!form.waktu_selesai) e.waktu_selesai = "Pilih waktu selesai";
    if (!form.jumlah_peserta || form.jumlah_peserta <= 0)
      e.jumlah_peserta = "Masukkan jumlah peserta";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await api.createBooking({
        ...form,
        jenis_konsumsi: form.jenis_konsumsi.join(","),
        nominal_konsumsi: parseFloat(form.nominal_konsumsi) || 0,
      });
      navigate("/", { state: { successMsg: 'Booking berhasil disimpan!' } });
    } catch (err) {
      toast.error(err.message || "Gagal menyimpan booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/")}
          className="w-8 h-8 flex items-center justify-center rounded text-white transition-colors"
          style={{ backgroundColor: "#4A8394" }}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Ruang Meeting</h1>
          <nav className="text-sm text-gray-400 flex items-center gap-1">
            <button
              onClick={() => navigate("/")}
              className="hover:text-[#4A8394]"
            >
              Ruang Meeting
            </button>
            <span>›</span>
            <span className="text-gray-600">Pesan Ruangan</span>
          </nav>
        </div>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-8"
      >
        {/* Section 1 */}
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Informasi Ruang Meeting
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Unit */}
          <div>
            <label className="form-label">Unit</label>
            <div className="relative">
              <select
                name="unit_id"
                value={form.unit_id}
                onChange={handleChange}
                className={`form-select pr-8 ${errors.unit_id ? "border-red-400" : ""}`}
              >
                <option value="">Pilih Unit</option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▾
              </div>
            </div>
            {errors.unit_id && (
              <p className="text-red-500 text-xs mt-1">{errors.unit_id}</p>
            )}
          </div>

          {/* Ruangan Meeting */}
          <div>
            <label className="form-label">Pilihan Ruangan Meeting</label>
            <div className="relative">
              <select
                name="room_id"
                value={form.room_id}
                onChange={handleChange}
                disabled={loading}
                className={`form-select pr-8 disabled:bg-gray-50 disabled:cursor-not-allowed ${errors.room_id ? "border-red-400" : ""}`}
              >
                <option value="">
                  {loading ? "Memuat..." : "Pilih Ruangan Meeting"}
                </option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▾
              </div>
            </div>
            {errors.room_id && (
              <p className="text-red-500 text-xs mt-1">{errors.room_id}</p>
            )}
          </div>
        </div>

        {/* Kapasitas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="mb-6 pr-0">
            <label className="form-label">Kapasitas Ruangan</label>
            <input
              type="text"
              value={kapasitas}
              readOnly
              placeholder="Kapasitas Ruangan"
              className="form-input bg-gray-100 text-gray-500 cursor-default"
            />
          </div>
        </div>

        <hr className="border-gray-100 mb-6" />

        {/* Section 2 */}
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Informasi Rapat
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Tanggal Rapat */}
          <div>
            <label className="form-label">
              Tanggal Rapat <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="tanggal_rapat"
                value={form.tanggal_rapat}
                onChange={handleChange}
                className={`form-input pl-9 ${errors.tanggal_rapat ? "border-red-400" : ""}`}
              />
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A8394] w-4 h-4 pointer-events-none" />
            </div>
            {errors.tanggal_rapat && (
              <p className="text-red-500 text-xs mt-1">
                {errors.tanggal_rapat}
              </p>
            )}
          </div>

          {/* Waktu Mulai */}
          <div>
            <label className="form-label">Pilihan Waktu Mulai</label>
            <div className="relative">
              <select
                name="waktu_mulai"
                value={form.waktu_mulai}
                onChange={handleChange}
                className={`form-select pr-8 ${errors.waktu_mulai ? "border-red-400" : ""}`}
              >
                <option value="">Pilih Waktu Mulai</option>
                {WAKTU_OPTIONS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▾
              </div>
            </div>
            {errors.waktu_mulai && (
              <p className="text-red-500 text-xs mt-1">{errors.waktu_mulai}</p>
            )}
          </div>

          {/* Waktu Selesai */}
          <div>
            <label className="form-label">Waktu Selesai</label>
            <div className="relative">
              <select
                name="waktu_selesai"
                value={form.waktu_selesai}
                onChange={handleChange}
                className={`form-select pr-8 ${errors.waktu_selesai ? "border-red-400" : ""}`}
              >
                <option value="">Pilih Waktu Selesai</option>
                {WAKTU_OPTIONS.filter(
                  (w) => w > (form.waktu_mulai || "00:00"),
                ).map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                ▾
              </div>
            </div>
            {errors.waktu_selesai && (
              <p className="text-red-500 text-xs mt-1">
                {errors.waktu_selesai}
              </p>
            )}
          </div>
        </div>

        {/* Jumlah Peserta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="mb-6">
            <label className="form-label">Jumlah Peserta</label>
            <input
              type="number"
              name="jumlah_peserta"
              value={form.jumlah_peserta}
              onChange={handleChange}
              placeholder="Masukan Jumlah Peserta"
              min={1}
              className={`form-input ${errors.jumlah_peserta ? "border-red-400" : ""}`}
            />
            {errors.jumlah_peserta && (
              <p className="text-red-500 text-xs mt-1">
                {errors.jumlah_peserta}
              </p>
            )}
          </div>
        </div>

        {/* Jenis Konsumsi */}
        <div className="mb-6">
          <label className="form-label">Jenis Konsumsi</label>
          <div className="flex flex-col gap-2 mt-1">
            {KONSUMSI_OPTIONS.map((k) => (
              <label
                key={k}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={form.jenis_konsumsi.includes(k)}
                  onChange={() => handleKonsumsiChange(k)}
                  className="w-4 h-4 rounded border-gray-300 text-[#4A8394] focus:ring-[#4A8394]"
                />
                <span className="text-sm text-gray-700">{k}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Nominal Konsumsi */}
        <div className="mb-8 md:w-1/3">
          <label className="form-label">Nominal Konsumsi</label>
          <div className="flex items-stretch">
            <span
              className="inline-flex items-center px-3 rounded-l border border-r-0 border-gray-300 text-white text-sm font-medium"
              style={{ backgroundColor: "#4A8394" }}
            >
              Rp
            </span>
            <input
              type="number"
              name="nominal_konsumsi"
              value={form.nominal_konsumsi}
              onChange={handleChange}
              placeholder="0"
              min={0}
              className="form-input rounded-l-none border-l-0"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-cancel"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
