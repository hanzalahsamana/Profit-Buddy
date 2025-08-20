export const getDomainWithPadding = (values, percentage = 0.1, minFloor = [0]) => {
  const nums = (values || []).map(Number).filter((v) => Number.isFinite(v));

  //   if (!nums.length) return [minFloor, minFloor + 1];

  let min = Math.min(...minFloor);
  let max = Math.max(...nums);

  // If all values equal, create a small range around them
  //   if (max === min) {
  //     const pad = Math.max(Math.abs(max) * percentage, 1);
  //     const paddedMin = Math.max(minFloor, min - pad);
  //     const paddedMax = max + pad;
  //     return [Math.floor(paddedMin), Math.ceil(paddedMax)];
  //   }

  const pad = (max - min) * percentage;

  const paddedMin = Math.max(0, min - min * percentage);
  const paddedMax = max + pad;

  // Round outwards so ticks look nicer
  return [Math.floor(paddedMin), Math.ceil(paddedMax)];
};
