export const dashboardCards = [
  {
    id: 1,
    title: 'Total Balance',
    amount: '$14,720.50',
    change: '+6.3%',
    icon: 'wallet',
    description: 'Available balance after expenses',
    accent: 'from-cyan-500 to-blue-600'
  },
  {
    id: 2,
    title: 'Income',
    amount: '$9,540.00',
    change: '+12.4%',
    icon: 'arrow-up',
    description: 'Earnings this month',
    accent: 'from-emerald-500 to-teal-500'
  },
  {
    id: 3,
    title: 'Expenses',
    amount: '$4,280.50',
    change: '-8.1%',
    icon: 'arrow-down',
    description: 'Total spent this month',
    accent: 'from-pink-500 to-rose-500'
  },
  {
    id: 4,
    title: 'Savings',
    amount: '$1,220.00',
    change: '+4.8%',
    icon: 'sparkles',
    description: 'Monthly savings',
    accent: 'from-violet-500 to-fuchsia-500'
  }
];

export const recentTransactions = [
  { id: 't1', title: 'Subscription', category: 'Software', type: 'expense', amount: '-$29.99', date: 'Jun 18', badge: 'Utilities' },
  { id: 't2', title: 'Freelance', category: 'Design', type: 'income', amount: '+$1,250', date: 'Jun 17', badge: 'Income' },
  { id: 't3', title: 'Groceries', category: 'Food', type: 'expense', amount: '-$145.40', date: 'Jun 16', badge: 'Essentials' },
  { id: 't4', title: 'Salary', category: 'Work', type: 'income', amount: '+$6,800', date: 'Jun 15', badge: 'Income' }
];

export const categoryBreakdown = [
  { label: 'Bills', value: 28, color: '#38bdf8' },
  { label: 'Food', value: 18, color: '#f472b6' },
  { label: 'Travel', value: 14, color: '#a78bfa' },
  { label: 'Shopping', value: 12, color: '#fbbf24' },
  { label: 'Health', value: 8, color: '#34d399' },
  { label: 'Other', value: 20, color: '#60a5fa' }
];

export const monthlyExpenses = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [420, 380, 520, 460, 490, 430]
};

export const profileData = {
  name: 'Keira Miles',
  email: 'keira.miles@example.com',
  role: 'Personal Finance Manager',
  budget: '$6,000',
  spent: '$4,280',
  location: 'San Francisco, CA'
};
