const SummaryCard = ({ title, value, description, icon }) => {
  return (
    <div className="rounded-[28px] border border-slate-800 bg-slate-950/85 p-6 shadow-2xl shadow-slate-950/20">
      <div className="flex items-center gap-4">
        <div className="rounded-3xl bg-slate-900 p-3 text-cyan-300">{icon}</div>
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{value}</h3>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
};

export default SummaryCard;
