import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from './Button';
import Input from './Input';
import Modal from './Modal';
import { createExpense, updateExpense } from '../../services/expenses';

const categories = ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Freelance', 'Other'];

const ExpenseModal = ({ open, onClose, initialData, onSaved }) => {
  const [formData, setFormData] = useState({ title: '', amount: '', category: '', type: 'expense', date: '', note: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category,
        type: initialData.type,
        date: initialData.date.split('T')[0],
        note: initialData.note || ''
      });
    } else {
      setFormData({ title: '', amount: '', category: '', type: 'expense', date: '', note: '' });
    }
  }, [initialData, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title || !formData.amount || !formData.category || !formData.date) {
      toast.error('Please fill required fields');
      return;
    }
    try {
      setLoading(true);
      if (initialData) {
        const response = await updateExpense(initialData._id, { ...formData, amount: Number(formData.amount) });
        onSaved(response.data.expense);
        toast.success('Expense updated');
      } else {
        const response = await createExpense({ ...formData, amount: Number(formData.amount) });
        onSaved(response.data.expense);
        toast.success('Expense added');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={initialData ? 'Edit Expense' : 'Add Expense'} open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Purchase title" />
        <Input label="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="150" type="number" />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-500">Type</span>
            <select
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block text-xs uppercase tracking-[0.22em] text-slate-500">Category</span>
            <select
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
          <Input label="Note" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} placeholder="Optional note" />
        </div>
        <div className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            {loading ? 'Saving...' : initialData ? 'Update expense' : 'Save expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseModal;
