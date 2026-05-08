export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Hapus', cancelLabel = 'Batal', loading = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-[fadeInScale_0.2s_ease-out]">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4h6v3M3 7h18" />
          </svg>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">{title}</h3>
        <p className="text-sm text-gray-500 text-center mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
