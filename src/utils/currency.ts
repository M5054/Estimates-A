export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  return Number(value.replace(/[^0-9.-]+/g, ''));
};