const CategoryBadge = ({ label, color }) => {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
      <span className="mr-2 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
};

export default CategoryBadge;
