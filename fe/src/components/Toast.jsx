import { useEffect, useState } from 'react';

function ToastItem({ id, type, message, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Auto-dismiss after 3.5s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 350);
    }, 3500);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, [id, onRemove]);

  const styles = {
    success: { bg: 'bg-emerald-50', border: 'border-emerald-400', icon: '✓', iconBg: 'bg-emerald-500', text: 'text-emerald-800' },
    error:   { bg: 'bg-red-50',     border: 'border-red-400',     icon: '✕', iconBg: 'bg-red-500',     text: 'text-red-800'     },
    info:    { bg: 'bg-blue-50',    border: 'border-blue-400',    icon: 'i', iconBg: 'bg-blue-500',    text: 'text-blue-800'    },
  };
  const s = styles[type] || styles.info;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${s.bg} ${s.border}
        transition-all duration-300 ease-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      style={{ minWidth: 280, maxWidth: 360 }}
    >
      <span className={`w-6 h-6 rounded-full ${s.iconBg} text-white text-xs flex items-center justify-center flex-shrink-0 font-bold`}>
        {s.icon}
      </span>
      <p className={`text-sm font-medium flex-1 ${s.text}`}>{message}</p>
      <button
        onClick={() => { setVisible(false); setTimeout(() => onRemove(id), 350); }}
        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem {...t} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    info:    (msg) => addToast(msg, 'info'),
  };

  return { toasts, removeToast, toast };
}
