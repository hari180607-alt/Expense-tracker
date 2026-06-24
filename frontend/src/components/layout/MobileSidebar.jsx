import { XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const items = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/transactions', label: 'Transactions' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/profile', label: 'Profile' },
  { path: '/add-expense', label: 'Add Expense' }
];

const MobileSidebar = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 p-5 backdrop-blur-xl">
      <div className="relative h-full overflow-y-auto rounded-[32px] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40">
        <button onClick={onClose} className="absolute right-5 top-5 rounded-full border border-slate-700 p-2 text-slate-200 transition hover:border-slate-500 hover:text-white">
          <XMarkIcon className="h-5 w-5" />
        </button>
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Menu</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Navigation</h2>
        </div>
        <nav className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="block rounded-3xl border border-slate-800 bg-slate-900 px-4 py-4 text-base font-medium text-slate-200 transition hover:border-cyan-500 hover:bg-slate-900/90 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default MobileSidebar;
