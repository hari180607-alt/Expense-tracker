import { motion } from 'framer-motion';

const StatsCard = ({ title, amount, change, description, accent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={`rounded-[28px] border border-slate-800 bg-slate-950/80 p-6 shadow-2xl shadow-slate-950/20 ${accent}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{title}</p>
          <h3 className="mt-4 text-3xl font-semibold text-white">{amount}</h3>
        </div>
        <span className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-emerald-400">{change}</span>
      </div>
      <p className="mt-5 text-sm leading-6 text-slate-400">{description}</p>
    </motion.div>
  );
};

export default StatsCard;
