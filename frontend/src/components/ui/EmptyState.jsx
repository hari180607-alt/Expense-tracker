const EmptyState = ({ title, message }) => {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-700 bg-slate-950/70 p-10 text-center text-slate-300">
      <div className="mx-auto mb-4 h-20 w-20 rounded-3xl bg-slate-900/80 shadow-inner shadow-slate-900/30" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-400">{message}</p>
    </div>
  );
};

export default EmptyState;
