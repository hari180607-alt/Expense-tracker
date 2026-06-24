import EmptyState from '../ui/EmptyState';
import CategoryBadge from './CategoryBadge';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { formatCurrency } from '../../utils/formatCurrency';
 
const ExpenseTable = ({ transactions, onEdit, onDelete }) => {
  if (!transactions?.length) {
    return <EmptyState title="No transactions yet" message="Create your first expense or income transaction to see it here." />;
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-slate-800 bg-slate-950/85 shadow-xl shadow-slate-950/20">
      <div className="border-b border-slate-800 bg-slate-900/80 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
          <thead className="bg-slate-950/90 text-slate-500">
            <tr>
              <th className="px-6 py-4">Transaction</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {transactions.map((transaction) => (
              <tr key={transaction._id || transaction.id} className="transition hover:bg-slate-900/70">
                <td className="px-6 py-4">
                  <p className="font-semibold text-white">{transaction.title}</p>
                  <p className="text-xs text-slate-500">{transaction.type}</p>
                </td>
                <td className="px-6 py-4">
                  <CategoryBadge label={transaction.category} color={transaction.type === 'income' ? '#34d399' : '#f472b6'} />
                </td>
                <td className={`px-6 py-4 font-semibold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date(transaction.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => onEdit && onEdit(transaction)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900/90">
                      <FiEdit /> Edit
                    </button>
                    <button onClick={() => onDelete && onDelete(transaction)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-rose-600/10 px-3 py-2 text-sm text-rose-300 hover:bg-rose-600/20">
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
