const ConfirmModal = ({ open, title = 'Confirm', message, onConfirm, onCancel, loading = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[24px] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-4 text-sm text-slate-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-3xl border border-slate-700 bg-transparent px-4 py-2 text-sm text-slate-300">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="rounded-3xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white">{loading ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
