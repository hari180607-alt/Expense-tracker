import { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import ExpenseTable from '../components/dashboard/ExpenseTable';
import ConfirmModal from '../components/ui/ConfirmModal';
import ExpenseModal from '../components/ui/ExpenseModal';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { getExpenses, deleteExpense } from '../services/expenses';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [confirm, setConfirm] = useState({ open: false, item: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getExpenses({ search, category, type, sort, page, limit });
      setTransactions(response.data.expenses || []);
      setMeta(response.data.meta || { total: 0, page, pages: 1 });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to load transactions');
    } finally {
      setLoading(false);
    }
  }, [search, category, type, sort, page, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAddModal = () => {
    setSelectedExpense(null);
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedExpense(item);
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    setConfirm({ open: true, item });
  };

  const confirmDelete = async () => {
    if (!confirm.item) return;
    try {
      await deleteExpense(confirm.item._id || confirm.item.id);
      setTransactions((prev) => prev.filter((t) => (t._id || t.id) !== (confirm.item._id || confirm.item.id)));
      toast.success('Transaction deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to delete transaction');
    } finally {
      setConfirm({ open: false, item: null });
    }
  };

  const handleSaved = (expense) => {
    if (selectedExpense) {
      setTransactions((prev) => prev.map((item) => ((item._id || item.id) === (expense._id || expense.id) ? expense : item)));
      toast.success('Transaction updated');
    } else {
      setTransactions((prev) => [expense, ...prev]);
      toast.success('Transaction added');
    }
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Transactions</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">All activity</h1>
            </div>
            <Button onClick={openAddModal}>Add transaction</Button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Input
                label="Search"
                placeholder="Search title"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-500">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                >
                  <option value="">All</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                  <option value="Salary">Salary</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-500">Type</span>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                >
                  <option value="">All</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </label>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-500">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest amount</option>
                  <option value="lowest">Lowest amount</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/20">
            <div className="flex justify-center py-20 text-slate-400">Loading transactions...</div>
          </div>
        ) : (
          <ExpenseTable transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {meta.pages > 1 && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button disabled={page <= 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
              Previous
            </Button>
            <span className="px-4 py-3 text-sm text-slate-300">Page {meta.page} of {meta.pages}</span>
            <Button disabled={page >= meta.pages} onClick={() => setPage((prev) => Math.min(meta.pages, prev + 1))}>
              Next
            </Button>
          </div>
        )}
      </div>

      <ExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} initialData={selectedExpense} onSaved={handleSaved} />

      <ConfirmModal
        open={confirm.open}
        title="Delete transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onCancel={() => setConfirm({ open: false, item: null })}
        onConfirm={confirmDelete}
      />
    </DashboardLayout>
  );
};

export default Transactions;
