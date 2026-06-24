import { BellIcon, MoonIcon, SunIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ onToggleMobile }) => {
  const { user, logout, updateTheme, theme } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = useMemo(
    () => [
      { id: 1, title: 'Goal reminder', message: 'Set a monthly target in your profile for better tracking.' },
      { id: 2, title: 'Transaction added', message: 'Your latest expense has been saved successfully.' },
      { id: 3, title: 'Insight ready', message: 'Open Analytics to review your latest spending trends.' }
    ],
    []
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    try {
      await updateTheme(nextTheme);
    } catch {
      // ignore theme update errors
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 rounded-[24px] border border-slate-700 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:gap-4 sm:p-5 md:flex-row md:items-center md:justify-between md:rounded-[28px] lg:p-6">
      <div className="flex w-full items-center justify-between gap-2 sm:gap-3">
        <button
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 sm:h-11 sm:w-11 md:hidden"
          onClick={onToggleMobile}
        >
          <span className="text-base">☰</span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs uppercase tracking-[0.22em] text-slate-500">Welcome</p>
          <h1 className="truncate text-base font-semibold text-white sm:text-lg">{user?.name?.split(' ')[0] || 'User'}</h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* <button
          onClick={toggleTheme}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-slate-500 hover:text-white sm:h-11 sm:w-11 sm:rounded-3xl"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <SunIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button> */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setNotificationsOpen((prev) => !prev)}
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-slate-500 hover:text-white sm:h-11 sm:w-11 sm:rounded-3xl"
            aria-expanded={notificationsOpen}
            aria-label="Notifications"
          >
            <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-slate-950">3</span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 z-50 mt-2 w-[280px] rounded-2xl border border-slate-700 bg-slate-950/95 p-3 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:mt-3 sm:rounded-3xl sm:p-4">
              <div className="mb-2 flex items-center justify-between sm:mb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 sm:text-sm sm:tracking-[0.22em]">Notifications</p>
                <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-semibold text-cyan-300">New</span>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-300 sm:p-4 sm:text-sm">
                    <p className="font-semibold text-white">{notification.title}</p>
                    <p className="mt-1 text-slate-400">{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <Link to="/profile" className="hidden items-center rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-500 hover:text-white sm:inline-flex md:rounded-3xl md:px-4 md:py-3 md:text-sm">
          {user?.name?.split(' ')[0] || 'You'}
        </Link>
        <button onClick={logout} className="hidden items-center gap-1 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 transition hover:border-slate-500 hover:text-white sm:inline-flex md:gap-2 md:rounded-3xl md:px-4 md:py-3 md:text-sm">
          <ArrowRightOnRectangleIcon className="h-4 w-4 md:h-5 md:w-5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
