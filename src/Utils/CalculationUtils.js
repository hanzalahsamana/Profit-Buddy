import { KEEPA_EPOCH_START_MINUTES, MIN_PROFIT, MIN_ROI } from '../Enums/Enums';

export const calculateMaxCost = (product) => {
  const abc = calculateAmazonPayout(product);
  const { totalFees } = abc;
  const { sellPrice } = product?.info || {};

  const maxCostByROI = (sellPrice - totalFees) / (1 + MIN_ROI);

  const profit = sellPrice - totalFees - maxCostByROI;

  if (profit >= MIN_PROFIT) {
    return Math.floor(maxCostByROI * 100) / 100;
  } else {
    const maxCostByProfit = sellPrice - totalFees - MIN_PROFIT;
    return Math.floor(maxCostByProfit * 100) / 100;
  }
};

export const calculateAmazonPayout = (product, storageMonths = 0, isFBA = true) => {
  const {
    weight = 0, // lbs
    referralFeePercent = 0,
    fbaFees = 0,
    prepFee = 1.5,
    closingFee = 0,
    placementFee = 0,
  } = product?.fees || {};

  const { sellPrice } = product?.info || {};

  const referralFee = sellPrice * referralFeePercent;

  const inboundShippingFee = weight * 0.6; // $0.60 per lb
  const storageFee = storageMonths * 0.75; // $0.75 per cubic foot/month (example)

  const totalFees = referralFee + (isFBA ? fbaFees : 0) + inboundShippingFee + storageFee + prepFee + placementFee + closingFee;

  const payout = sellPrice - totalFees;

  return {
    sellPrice,
    referralFee,
    fulfillmentFee: isFBA ? fbaFees : 0,
    inboundShippingFee,
    storageFee,
    prepFee,
    placementFee,
    closingFee,
    totalFees,
    payout,
  };
};

function calculateProfitMargin(sellingPrice, costPrice, referralFee, fulfillmentFee) {
  const totalCost = costPrice + referralFee + fulfillmentFee;
  const profit = sellingPrice - totalCost;
  const profitMargin = (profit / sellingPrice) * 100;
  return profitMargin.toFixed(2);
}

export const calculateProfitAndROI = (product, costPrice) => {
  const { totalFees, sellPrice } = calculateAmazonPayout(product);

  const profit = calculateProfit({ sellPrice, costPrice, totalFees });
  const roi = calculateROI({ profit, costPrice });

  return {
    profit: Math.floor(profit * 100) / 100, // round to 2 decimals
    roi,
  };
};
const sellingPrice2 = 54.5;
const costPrice = 29.81;
const referralFee2 = 9.27;
const fulfillmentFee2 = 7.96;
