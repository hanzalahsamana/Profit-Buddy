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

export const calculateTotalFees = (product, sellPrice, storageMonths = 0, isFBA = true) => {
  const { referralFeePercent = 0, fbaFees = 0, prepFee = 1.5, closingFee = 0, placementFee = 0 } = product?.fees || {};

  const { weight = 0 } = product?.info || {};

  const referralFee = sellPrice * referralFeePercent;

  const inboundShippingFee = isFBA ? weight * 0.6 : 0;
  const storageFee = isFBA ? storageMonths * 0.75 : 0;
  const appliedPrepFee = isFBA ? prepFee : 0;
  const appliedPlacementFee = isFBA ? placementFee : 0;
  const fulfillmentFee = isFBA ? fbaFees : 0;

  const totalFees = referralFee + fulfillmentFee + inboundShippingFee + storageFee + appliedPrepFee + appliedPlacementFee + closingFee;

  return {
    referralFeePercent,
    referralFee,
    fulfillmentFee,
    inboundShippingFee,
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

export const calculateProfit = ({ sellPrice, costPrice, totalFees }) => {
  // if (!sellPrice || !costPrice) return 0;
  return sellPrice - costPrice - (totalFees || 0);
};

export const calculateROI = ({ profit, costPrice }) => {
  // if (!costPrice) return 0;
  return ((profit / costPrice) * 100).toFixed(2); // ROI %
};

export const calculateProfitAndROI = (totalFees, sellPrice, costPrice) => {
  const profit = calculateProfit({ sellPrice, costPrice, totalFees });
  const roi = calculateROI({ profit, costPrice });

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
