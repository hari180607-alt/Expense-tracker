import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { createExpense } from '../services/expenses';

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Other'];

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', category: '', amount: '', type: 'expense', date: '', note: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title || !formData.amount || !formData.category || !formData.date) {
      toast.error('Please complete the required fields.');
      return;
    }

    try {
      setSaving(true);
      await createExpense({ ...formData, amount: Number(formData.amount) });
      toast.success('Expense created successfully');
      navigate('/transactions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create expense');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-800 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Create transaction</p>
              <h1 className="mt-3 text-3xl font-semibold text-white">Add new expense or income</h1>
            </div>
            <Button type="submit" form="expenseForm" disabled={saving}>
              {saving ? 'Saving...' : 'Save transaction'}
            </Button>
          </div>
          <form id="expenseForm" onSubmit={handleSubmit} className="mt-8 grid gap-6 md:grid-cols-2">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Internet bill"
            />
            <Input
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g. 125.00"
            />
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-500">Category</span>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-slate-300">
              <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-500">Type</span>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </label>
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <Input
              label="Note"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Optional note"
            />
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddExpense;
