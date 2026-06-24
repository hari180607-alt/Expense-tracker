import { useEffect, useState } from 'react';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, BanknotesIcon, SparklesIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import { getExpenseStats } from '../services/expenses';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SummaryCard from '../components/dashboard/SummaryCard';
import { toast } from 'react-hot-toast';
import { formatCurrency } from '../utils/formatCurrency';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [target, setTarget] = useState(user?.target || '');
  const [theme, setTheme] = useState(user?.preferences?.theme || 'dark');
  const [profileSaving, setProfileSaving] = useState(false);

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setProfileSaving(true);
    try {
      await updateProfile({ target: Number(target || 0), preferences: { ...user.preferences, theme } });
      toast.success('Profile settings updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  useEffect(() => {
    setTarget(user?.target ?? '');
    setTheme(user?.preferences?.theme || 'dark');

    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await getExpenseStats();
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load profile stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user]);

  if (loading) return <DashboardLayout><Spinner /></DashboardLayout>;
  if (error || !user) return <DashboardLayout><EmptyState title="Profile unavailable" message={error || 'User profile could not be loaded.'} /></DashboardLayout>;

  const totalIncome = stats?.totalIncome || 0;
  const totalExpense = stats?.totalExpense || 0;
  const balance = stats?.balance || 0;
  const monthlyTarget = user?.target || 0;
  const targetProgress = monthlyTarget > 0 ? Math.min(100, (totalExpense / monthlyTarget) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Profile</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">{user.name}</h1>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-900 px-4 py-3 text-slate-300">
              <UserCircleIcon className="h-6 w-6 text-cyan-400" />
              Account details
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-[28px] border border-slate-800 bg-slate-950/85 p-6">
              <h2 className="text-lg font-semibold text-white">Personal Info</h2>
              <div className="mt-6 space-y-4 text-slate-400">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Email</p>
                  <p className="mt-2 text-lg text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Member since</p>
                  <p className="mt-2 text-lg text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Theme</p>
                  <p className="mt-2 text-lg text-white capitalize">{theme}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <SummaryCard title="Income" value={formatCurrency(totalIncome)} description="Total income this period." icon={<BanknotesIcon className="h-5 w-5" />} />
                <SummaryCard title="Expenses" value={formatCurrency(totalExpense)} description="Total expenses this period." icon={<ArrowDownTrayIcon className="h-5 w-5" />} />
                <SummaryCard title="Balance" value={formatCurrency(balance)} description="Net cash flow." icon={<SparklesIcon className="h-5 w-5" />} />
              </div>
              <div className="rounded-[28px] border border-slate-800 bg-slate-950/85 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Savings progress</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">{monthlyTarget ? `${Math.round(targetProgress)}% of target` : 'No target set'}</h2>
                  </div>
                  <div className="rounded-3xl bg-slate-900 px-4 py-2 text-sm text-slate-300">Monthly target</div>
                </div>
                <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-900">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: `${targetProgress}%` }} />
                </div>
                {monthlyTarget > 0 && (
                  <p className="mt-4 text-sm text-slate-400">You have {formatCurrency(Math.max(0, monthlyTarget - totalExpense))} remaining to hit your monthly goal.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-slate-800 bg-slate-950/85 p-6">
              <h2 className="text-lg font-semibold text-white">Profile settings</h2>
              <p className="mt-2 text-sm text-slate-400">Manage your monthly target and preferred theme.</p>
              <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
                <Input
                  label="Monthly target"
                  type="number"
                  value={target}
                  min="0"
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Set your monthly savings goal"
                />
                <label className="block text-sm text-slate-300">
                  <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-500">Theme preference</span>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>
                <Button type="submit" className="w-full md:w-auto" disabled={profileSaving}>
                  {profileSaving ? 'Saving...' : 'Save settings'}
                </Button>
              </form>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-slate-950/85 p-6">
              <h2 className="text-lg font-semibold text-white">Account summary</h2>
              <div className="mt-6 space-y-4 text-slate-300">
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Monthly target</p>
                  <p className="mt-2 text-lg text-white">{monthlyTarget ? formatCurrency(monthlyTarget) : 'Not configured'}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Current theme</p>
                  <p className="mt-2 text-lg text-white capitalize">{theme}</p>
                </div>
                <div className="rounded-3xl bg-slate-900/80 p-4">
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Member since</p>
                  <p className="mt-2 text-lg text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
