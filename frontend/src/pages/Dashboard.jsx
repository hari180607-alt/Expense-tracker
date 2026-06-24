import { useEffect, useMemo, useState } from 'react';
import { ArrowDownTrayIcon, ArrowUpTrayIcon, BanknotesIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';
import SummaryCard from '../components/dashboard/SummaryCard';
import StatsCard from '../components/dashboard/StatsCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { getExpenseStats } from '../services/expenses';
import { formatCurrency } from '../utils/formatCurrency';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const response = await getExpenseStats();
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const target = user?.target || 0;
  const expenseTotal = stats?.totalExpense || 0;
  const progress = target > 0 ? Math.min(100, (expenseTotal / target) * 100) : 0;
  const remaining = target > 0 ? Math.max(0, target - expenseTotal) : 0;

  const monthlyStats = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const totals = {};

    stats?.monthly?.forEach((item) => {
      const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      totals[key] = (totals[key] || 0) + item.total;
    });

    const labels = [];
    const data = [];
    const now = new Date();

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      labels.push(months[date.getMonth()]);
      data.push(totals[key] || 0);
    }

    return { labels, data };
  }, [stats]);

  const doughnutData = useMemo(
    () => ({
      labels: stats?.categoryTotals?.map((item) => item.category) || [],
      datasets: [
        {
          data: stats?.categoryTotals?.map((item) => item.total) || [],
          backgroundColor: ['#38bdf8', '#f472b6', '#a78bfa', '#fbbf24', '#34d399', '#60a5fa', '#fb7185', '#f59e0b'],
          borderWidth: 0,
        },
      ],
    }),
    [stats]
  );

  const barData = useMemo(
    () => ({
      labels: monthlyStats.labels,
      datasets: [
        {
          label: 'Spending trend',
          data: monthlyStats.data,
          backgroundColor: 'rgba(56,189,248,0.85)',
          borderRadius: 18,
          maxBarThickness: 28,
        },
      ],
    }),
    [monthlyStats]
  );

  if (loading) {
    return (
      <DashboardLayout>
        <Spinner />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <EmptyState title="Dashboard unavailable" message={error} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-7 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Hello, {user?.name?.split(' ')[0] || 'there'}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Your spending summary for the current period. Keep an eye on progress toward your monthly target and discover where your money goes.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">Updated in real time</div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <SummaryCard
            icon={<ArrowUpTrayIcon className="h-5 w-5" />}
            title="Income"
            value={formatCurrency(stats?.totalIncome || 0)}
            description="Total income recorded this period."
          />
          <SummaryCard
            icon={<ArrowDownTrayIcon className="h-5 w-5" />}
            title="Expenses"
            value={formatCurrency(stats?.totalExpense || 0)}
            description="Verified expenses across all categories."
          />
          <SummaryCard
            icon={<BanknotesIcon className="h-5 w-5" />}
            title="Balance"
            value={formatCurrency(stats?.balance || 0)}
            description="Your net balance after income and expenses."
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Monthly target</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">{target ? formatCurrency(target) : 'No target set'}</h2>
              </div>
              <div className="inline-flex items-center rounded-3xl bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                {target ? `${Math.round(progress)}%` : 'Set a goal'}
              </div>
            </div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-900">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-slate-900/80 p-4 text-slate-300">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Remaining</p>
                <p className="mt-2 text-xl font-semibold text-white">{target ? formatCurrency(remaining) : '—'}</p>
              </div>
              <div className="rounded-[24px] bg-slate-900/80 p-4 text-slate-300">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Total spent</p>
                <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(expenseTotal)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <StatsCard
              accent="bg-slate-950/90"
              title="Category distribution"
              amount="Insights"
              change="Updated"
              description="See your spending split by category for the current period."
            />
            <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Breakdown</p>
                  <h2 className="mt-2 text-xl font-semibold text-white">Top spending categories</h2>
                </div>
                <SparklesIcon className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="mt-6">
                {stats?.categoryTotals?.length ? (
                  <Doughnut
                    data={doughnutData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          labels: { color: '#94a3b8' }
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.label}: ${formatCurrency(context.parsed)}`
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <p className="text-sm text-slate-400">Add expenses to see category analytics.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Trend</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Expense trend</h2>
            </div>
            <p className="text-sm text-slate-400">6 months view of your spending.</p>
          </div>
          <div className="mt-6">
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  tooltip: { callbacks: { label: (context) => formatCurrency(context.parsed.y || 0) } }
                },
                scales: {
                  x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                  y: { grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: '#94a3b8' } }
                }
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;