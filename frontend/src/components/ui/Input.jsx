const Input = ({ label, className = '', ...props }) => {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-500">{label}</span>
      <input
        className={`w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 ${className}`}
        {...props}
      />
    </label>
  );
};

export default Input;
