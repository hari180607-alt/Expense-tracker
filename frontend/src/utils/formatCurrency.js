export const formatCurrency = (
  amount,
  currency = 'INR',
  locale = 'en-IN'
) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};
