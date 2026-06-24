import { ChartPieIcon, HomeIcon, RectangleStackIcon, UserCircleIcon, WalletIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { path: '/transactions', icon: RectangleStackIcon, label: 'Transactions' },
  { path: '/analytics', icon: ChartPieIcon, label: 'Analytics' },
  { path: '/profile', icon: UserCircleIcon, label: 'Profile' },
  { path: '/add-expense', icon: WalletIcon, label: 'Add Expense' }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:block w-full max-w-[240px] shrink-0 space-y-4 rounded-[24px] border border-slate-800 bg-slate-950/90 p-4 shadow-2xl shadow-slate-950/30 sm:max-w-[260px] sm:rounded-[28px] sm:p-5 lg:max-w-[280px]">
      <div className="mb-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-slate-950/80 p-4 text-white sm:p-5 sm:rounded-3xl">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Expense Tracker</p>
        <h2 className="mt-2 text-xl font-semibold sm:mt-3 sm:text-2xl">Finance</h2>
      </div>
      <nav className="space-y-1 sm:space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium transition sm:gap-3 sm:px-4 sm:py-3 sm:text-sm ${
                active ? 'bg-slate-900 text-white shadow-lg shadow-cyan-500/10' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
