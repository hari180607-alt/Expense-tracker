const Modal = ({ title, open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border border-slate-700 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-slate-500 hover:text-white">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
