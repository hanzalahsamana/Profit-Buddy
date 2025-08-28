export const getDomainWithPadding = (values, percentage = 0.1, minFloor = [0]) => {
  const nums = (values || []).map(Number).filter((v) => Number.isFinite(v));

  //   if (!nums.length) return [minFloor, minFloor + 1];

  let min = Math.min(...minFloor);
  let max = Math.max(...nums);

  // If all values equal, create a small range around them
  if (max === min) {
    const pad = Math.max(Math.abs(max) * percentage, 0);
    const paddedMin = Math.max(0, min - pad);
    const paddedMax = max + pad;
    return [Math.floor(paddedMin), Math.ceil(paddedMax)];
  }

  const pad = (max - min) * percentage;

  const paddedMin = Math.max(0, min - min * percentage);
  const paddedMax = max + pad;

  // Round outwards so ticks look nicer
  return [Math.floor(paddedMin), Math.ceil(paddedMax)];
};

export const getEvenlySpacedTicks = (data, count) => {
  if (!data || data.length === 0) return [];

  if (count === 1) return [data[0].date];
  if (count >= data.length) return data.map((d) => d.date);

  const step = (data.length - 1) / (count - 1);

  const ticks = [];
  for (let i = 0; i < count; i++) {
    const index = Math.round(i * step);
    // const formatedDate = formatDate();
    ticks.push(data[index]?.date);
  }

  return ticks;
};

export const generateTicks = (min, max, step = 5) => {
  const ticks = [];
  const range = max - min;
  const interval = Math.max(1, Math.floor(range / step));

  for (let i = min; i <= max; i += interval) {
    ticks.push(i);
  }

  // Ensure first and last are included
  if (!ticks.includes(min)) ticks.unshift(min);
  if (!ticks.includes(max)) ticks.push(max);

  return ticks;
};

export const formatDate = (date = '') => {
  if (!date) return;
  const locale = 'en-US';
  const dateFormatOptions = { month: 'short', day: 'numeric' };

  return new Date(date).toLocaleDateString(locale, dateFormatOptions);
};
export const formatTime = (date = '') => {
  if (!date) return;
  const locale = 'en-US';
  const timeFormatOptions = { hour: '2-digit', minute: '2-digit' };

  return new Date(date).toLocaleTimeString(locale, timeFormatOptions);
};
