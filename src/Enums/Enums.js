export const Project_Name = 'profit buddy';

//keepa time converter
export const KEEPA_EPOCH_START_MINUTES = 21564000;

//minimum valid product criteria
export const MIN_ROI = 0.25;
export const MIN_PROFIT = 3.0;

//currency
export const CURRENCY = '$';

//Graph Configs
export const SalesGraphKeys = {
  salesRank: { label: 'Sales Rank', symbol: '#', color: '#299912dc', yAxis: 'right', type: 'line' },
  buyBox: { label: 'Buybox', symbol: '$', color: '#f70cd0dc', yAxis: 'left', type: 'line' },
  amazon: { label: 'Amazon', symbol: '$', color: '#ff5900dc', yAxis: 'left', type: 'area' },
  new: { label: 'New', symbol: '$', color: '#a600ffdc', yAxis: 'left', type: 'line' },
};

export const OfferGraphKeys = {
  offerCount: { label: 'Offer Count', symbol: '#', color: '#000000', yAxis: 'left', type: 'area' },
  // offerCount: { label: 'Offer Count', symbol: '#', color: '#000000', yAxis: 'left', type: 'area' },
};
