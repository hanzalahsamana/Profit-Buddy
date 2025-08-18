import { CURRENCY } from '../Enums/Enums';

export const abbreviateNumber = (num) => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num?.toString();
};

export const formatNumberWithCommas = (num, decimals = 2, wantCurrencyCode = true) => {
  if (num === null || num === undefined || isNaN(num)) return '0.00';

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);

  return wantCurrencyCode ? `${CURRENCY}${formatted}` : formatted;
};
