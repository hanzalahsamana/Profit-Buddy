export const formatNumber = (value, decimals = 2, fallback = "0.00") => {
  const num = Number(value);
  return !isNaN(num) ? num.toFixed(decimals) : fallback;
};
