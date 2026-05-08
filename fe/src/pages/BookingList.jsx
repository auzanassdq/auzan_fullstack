import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { ChevronLeftIcon, PlusIcon, TrashIcon } from '../components/Icons';
import ConfirmModal from '../components/ConfirmModal';
import { ToastContainer, useToast } from '../components/Toast';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function BookingList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, removeToast, toast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });
  const [deleting, setDeleting] = useState(false);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getBookings(page);
      setBookings(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError('Gagal memuat data. Pastikan backend berjalan di port 3001.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1);
  }, []);

  // Show success message from navigation state (e.g. after creating a booking)
  useEffect(() => {
    if (location.state?.successMsg) {
      toast.success(location.state.successMsg);
      // Clear the state so it doesn't re-trigger on re-render
      window.history.replaceState({}, '');
    }
  }, []);

  const openDeleteModal = (booking) => {
    setDeleteModal({ open: true, id: booking.id, name: `${booking.ruang_meeting} (${formatDate(booking.tanggal_rapat)})` });
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModal({ open: false, id: null, name: '' });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await api.deleteBooking(deleteModal.id);
      setDeleteModal({ open: false, id: null, name: '' });
      toast.success('Booking berhasil dihapus.');
      fetchBookings(pagination.page);
    } catch {
      toast.error('Gagal menghapus booking. Coba lagi.');
    } finally {
      setDeleting(false);
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchBookings(page);
  };

  const getPageNumbers = () => {
    const { page, totalPages } = pagination;
    const pages = [];
    const range = 2;
    for (let i = Math.max(1, page - range); i <= Math.min(totalPages, page + range); i++) {
      pages.push(i);
    }
    return pages;
  };

  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div>
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        title="Hapus Booking?"
        message={`Data booking "${deleteModal.name}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        cancelLabel="Batal"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded text-white transition-colors cursor-pointer"
            style={{ backgroundColor: '#4A8394' }}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Ruang Meeting</h1>
            <p className="text-sm text-gray-500">Ruang Meeting</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/booking/new')}
          className="flex items-center gap-2 text-white px-4 py-2 rounded font-medium transition-colors text-sm cursor-pointer"
          style={{ backgroundColor: '#4A8394' }}
        >
          <PlusIcon className="w-4 h-4" />
          Pesan Ruangan
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="inline-block w-8 h-8 border-4 border-[#4A8394] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <button onClick={() => fetchBookings(1)} className="text-[#4A8394] text-sm hover:underline cursor-pointer">
              Coba lagi
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="table-th">Unit</th>
                    <th className="table-th">Ruang Meeting</th>
                    <th className="table-th">Kapasitas</th>
                    <th className="table-th">Tanggal Rapat</th>
                    <th className="table-th">Waktu</th>
                    <th className="table-th">Jumlah Peserta</th>
                    <th className="table-th">Jenis Konsumsi</th>
                    <th className="table-th w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-gray-400 text-sm">
                        Belum ada data peminjaman ruang meeting
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b, idx) => (
                      <tr
                        key={b.id}
                        className={`border-b border-gray-100 hover:bg-[#4A8394]/10 transition-colors ${idx % 2 === 0 ? '' : ''}`}
                      >
                        <td className="table-td font-semibold text-gray-800">{b.unit}</td>
                        <td className="table-td text-gray-500">{b.ruang_meeting}</td>
                        <td className="table-td text-gray-500">{b.kapasitas} Orang</td>
                        <td className="table-td text-gray-600">{formatDate(b.tanggal_rapat)}</td>
                        <td className="table-td text-gray-500 whitespace-nowrap">
                          {b.waktu_mulai} s/d {b.waktu_selesai}
                        </td>
                        <td className="table-td text-gray-600">{b.jumlah_peserta} Orang</td>
                        <td className="table-td text-gray-500">
                          {b.jenis_konsumsi ? (
                            <div className="flex flex-col gap-0.5">
                              {b.jenis_konsumsi.split(',').map((k) => (
                                <span key={k}>{k.trim()}</span>
                              ))}
                            </div>
                          ) : '-'}
                        </td>
                        <td className="table-td">
                          <button
                            onClick={() => openDeleteModal(b)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                            title="Hapus"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing <strong>{start}–{end}</strong> of <strong>{pagination.total}</strong>
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1.5 text-sm rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    ‹ Back
                  </button>
                  {getPageNumbers().map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-8 h-8 text-sm rounded border transition-colors cursor-pointer
                        ${pagination.page === p
                          ? 'border-[#4A8394] text-[#4A8394] bg-[#4A8394]/10 font-semibold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1.5 text-sm rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
