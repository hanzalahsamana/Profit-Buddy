import { MIN_PROFIT, MIN_ROI, PLACEMENT_FEE_TYPES } from '../Enums/Enums';

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

export const calculateTotalFees = (product, sellPrice, storageMonths = 0, isFBA = true, placementFeeType = PLACEMENT_FEE_TYPES[0]) => {
  const { referralFeePercent = 0, fbaFees = 0, prepFee = 0, closingFee = 0, inboundPlacementFee = {}, inboundShippingFee = 0 } = product?.fees || {};

  const { highestFba, lowestFba } = getFbaFeeRange(product?.info?.sellPrice, fbaFees);

  const currentPlacementFee = inboundPlacementFee?.[placementFeeType];

  const referralFee = sellPrice * referralFeePercent;

  const appliedInboundShippingFee = isFBA ? inboundShippingFee : 0;
  const storageFee = isFBA ? storageMonths * 0.75 : 0;
  const appliedPrepFee = isFBA ? prepFee : 0;
  const appliedPlacementFee = isFBA ? currentPlacementFee : 0;
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

export const calculateOfferProfitAndROI = (product, offerPrice, storageMonth, fulfillment, buyCost , placementFeeType) => {
  try {
    const fees = calculateTotalFees(product ?? {}, Number(offerPrice) || 0, storageMonth ?? 0, fulfillment === 'FBA' ,placementFeeType );

    const { profit = 0, roi = 0 } = calculateProfitAndROI(fees?.totalFees, Number(offerPrice) || 0, Number(buyCost) || 0) || {};

    return { profit, roi };
  } catch (err) {
    console.error('Error in safeProfitAndROI:', err);
    return { profit: 0, roi: 0 };
  }
};
