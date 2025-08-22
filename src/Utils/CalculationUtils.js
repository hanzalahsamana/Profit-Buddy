import { MIN_PROFIT, MIN_ROI } from '../Enums/Enums';

export const calculateMaxCost = (sellPrice, totalFees) => {
  const maxCostByROI = (sellPrice - totalFees) / (1 + MIN_ROI);

  const profit = sellPrice - totalFees - maxCostByROI;

  if (profit >= MIN_PROFIT) {
    return Math.floor(maxCostByROI * 100) / 100;
  } else {
    const maxCostByProfit = sellPrice - totalFees - MIN_PROFIT;
    return Math.floor(maxCostByProfit * 100) / 100;
  }
};

export const getFbaFeeRange = (originalSellPrice, fbaFee) => {
  if (originalSellPrice < 10) {
    return {
      lowestFba: Number(fbaFee.toFixed(2)),
      highestFba: Number((fbaFee + 0.77).toFixed(2)),
    };
  } else {
    return {
      lowestFba: Number(Math.max(0, fbaFee - 0.77).toFixed(2)),
      highestFba: Number(fbaFee.toFixed(2)),
    };
  }
};

export const calculateTotalFees = (product, sellPrice, storageMonths = 0, isFBA = true) => {
  const { referralFeePercent = 0, fbaFees = 0, prepFee = 0, closingFee = 0, placementFee = 0, inboundShippingFee = 0 } = product?.fees || {};

  const { highestFba, lowestFba } = getFbaFeeRange(product?.info?.sellPrice, fbaFees);

  const referralFee = sellPrice * referralFeePercent;

  const appliedInboundShippingFee = isFBA ? inboundShippingFee : 0;
  const storageFee = isFBA ? storageMonths * 0.75 : 0;
  const appliedPrepFee = isFBA ? prepFee : 0;
  const appliedPlacementFee = isFBA ? placementFee : 0;
  const fulfillmentFee = isFBA ? (sellPrice < 10 ? lowestFba : highestFba) : 0;

  const totalFees = referralFee + fulfillmentFee + appliedInboundShippingFee + storageFee + appliedPrepFee + appliedPlacementFee + closingFee;

  return {
    referralFeePercent,
    referralFee,
    fulfillmentFee,
    inboundShippingFee: appliedInboundShippingFee,
    storageFee,
    prepFee: appliedPrepFee,
    placementFee: appliedPlacementFee,
    closingFee,
    totalFees,
  };
};

export const calculateProfitMargin = (sellingPrice, costPrice, referralFee, fulfillmentFee) => {
  const totalCost = costPrice + referralFee + fulfillmentFee;
  const profit = sellingPrice - totalCost;
  const profitMargin = (profit / sellingPrice) * 100;
  return profitMargin.toFixed(2);
};

export const calculateProfit = (sellPrice, costPrice, totalFees) => {
  return sellPrice - costPrice - (totalFees || 0);
};

export const calculateROI = (profit, costPrice) => {
  return ((profit / costPrice) * 100).toFixed(2); // ROI %
};

export const calculateProfitAndROI = (totalFees, sellPrice, costPrice) => {
  const profit = calculateProfit(sellPrice, costPrice, totalFees);
  const roi = calculateROI(profit, costPrice);

  return {
    profit: Math.floor(profit * 100) / 100,
    roi,
  };
};

export const calculateOfferProfitAndROI = (product, offerPrice, storageMonth, fulfillment, buyCost) => {
  try {
    const fees = calculateTotalFees(product ?? {}, Number(offerPrice) || 0, storageMonth ?? 0, fulfillment === 'FBA');

    const { profit = 0, roi = 0 } = calculateProfitAndROI(fees?.totalFees, Number(offerPrice) || 0, Number(buyCost) || 0) || {};

    return { profit, roi };
  } catch (err) {
    console.error('Error in safeProfitAndROI:', err);
    return { profit: 0, roi: 0 };
  }
};

const calculateInboundFee = ({
  sizeTier, // "smallStandard" | "largeStandard" | "largeBulky"
  weightOz = 0, // weight in ounces
  weightLb = 0, // weight in pounds (use lb if bulky)
  units = 1, // number of units
  shipmentSplit, // "minimal" | "partial" | "amazonOptimized"
}) => {
  const weight = weightLb > 0 ? weightLb : weightOz / 16;

  let feeRange = null;

  if (sizeTier === 'smallStandard') {
    if (weight <= 1) {
      feeRange = { min: 0.16, max: 0.3, amazonOptimized: 0 };
    }
  }

  if (sizeTier === 'largeStandard') {
    if (weight <= 0.75) {
      feeRange = { min: 0.18, max: 0.34, amazonOptimized: 0 };
    } else if (weight <= 1.5) {
      feeRange = { min: 0.22, max: 0.41, amazonOptimized: 0 };
    } else if (weight <= 3) {
      feeRange = { min: 0.27, max: 0.49, amazonOptimized: 0 };
    } else if (weight <= 20) {
      feeRange = { min: 0.37, max: 0.68, amazonOptimized: 0 };
    }
  }

  if (sizeTier === 'largeBulky') {
    if (weight <= 5) {
      feeRange = { minimal: { min: 1.1, max: 1.6 }, partial: { min: 0.55, max: 1.1 }, amazonOptimized: 0 };
    } else if (weight <= 12) {
      feeRange = { minimal: { min: 1.75, max: 2.4 }, partial: { min: 0.65, max: 1.75 }, amazonOptimized: 0 };
    } else if (weight <= 28) {
      feeRange = { minimal: { min: 2.74, max: 3.5 }, partial: { min: 0.81, max: 2.19 }, amazonOptimized: 0 };
    } else if (weight <= 42) {
      feeRange = { minimal: { min: 3.95, max: 4.95 }, partial: { min: 1.05, max: 2.83 }, amazonOptimized: 0 };
    } else if (weight <= 50) {
      feeRange = { minimal: { min: 4.8, max: 5.95 }, partial: { min: 1.23, max: 3.32 }, amazonOptimized: 0 };
    }
  }

  if (!feeRange) {
    return { error: 'No fee range found for given size/weight.' };
  }

  let perUnitFee;
  if (sizeTier === 'largeBulky') {
    if (shipmentSplit === 'minimal') {
      perUnitFee = feeRange.minimal;
    } else if (shipmentSplit === 'partial') {
      perUnitFee = feeRange.partial;
    } else if (shipmentSplit === 'amazonOptimized') {
      perUnitFee = { min: 0, max: 0 };
    }
  } else {
    if (shipmentSplit === 'minimal') {
      perUnitFee = { min: feeRange.min, max: feeRange.max };
    } else if (shipmentSplit === 'amazonOptimized') {
      perUnitFee = { min: 0, max: 0 };
    }
  }

  return {
    perUnitFee,
    totalFeeRange: {
      min: perUnitFee.min * units,
      max: perUnitFee.max * units,
    },
  };
};

// Example usage:
console.log(
  calculateInboundFee({
    sizeTier: 'largeStandard',
    weightLb: 2,
    units: 500,
    shipmentSplit: 'minimal',
  })
);
