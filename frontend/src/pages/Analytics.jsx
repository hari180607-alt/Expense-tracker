import { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { getExpenseStats } from '../services/expenses';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await getExpenseStats();
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load analytics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <DashboardLayout><Spinner /></DashboardLayout>;
  if (error || !stats) return <DashboardLayout><EmptyState title="Analytics not available" message={error || 'No analytics data available.'} /></DashboardLayout>;

  const pieData = {
    labels: stats.categoryTotals.map((item) => item.category),
    datasets: [
      {
        data: stats.categoryTotals.map((item) => item.total),
        backgroundColor: ['#38bdf8', '#f472b6', '#a78bfa', '#fbbf24', '#34d399', '#60a5fa', '#fb7185', '#f59e0b'],
        borderWidth: 0
      }
    ]
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyGrouped = {};
  stats.monthly.forEach((item) => {
    const key = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
    monthlyGrouped[key] = (monthlyGrouped[key] || 0) + item.total;
  });

  const labels = [];
  const data = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    labels.push(months[date.getMonth()]);
    data.push(monthlyGrouped[key] || 0);
  }

  const barData = {
    labels,
    datasets: [
      {
        label: 'Expense trend',
        data,
        backgroundColor: 'rgba(96,165,250,0.85)',
        borderRadius: 20,
        maxBarThickness: 26
      }
    ]
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Analytics</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Spending insights</h1>
            </div>
            <div className="rounded-3xl bg-slate-900 px-4 py-3 text-sm text-slate-300">Driven by real transactions</div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20">
            <h2 className="text-xl font-semibold text-white">Category distribution</h2>
            <Pie data={pieData} className="mt-6" />
          </div>
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20">
            <h2 className="text-xl font-semibold text-white">Monthly trend</h2>
            <Bar data={barData} className="mt-6" options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(148,163,184,0.15)' }, ticks: { color: '#94a3b8' } } } }} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
