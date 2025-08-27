export const Project_Name = 'profit buddy';

//keepa time converter
export const KEEPA_EPOCH_START_MINUTES = 21564000;

//minimum valid product criteria
export const MIN_ROI = 0.25;
export const MIN_PROFIT = 3.0;

//Place Fee Types
export const PLACEMENT_FEE_TYPES = ['minimal', 'partial', 'optimized'];

//currency
export const CURRENCY = '$';

//Graph Configs
export const SalesGraphKeys = {
  salesRank: { label: 'Sales Rank', symbol: '#', color: '#299912dc', yAxis: 'right', type: 'line', decimal: false },
  newPrice: { label: 'New Price', symbol: CURRENCY, color: '#039BE5', yAxis: 'left', type: 'line', decimal: true },
  amazon: { label: 'Amazon', symbol: CURRENCY, color: '#ff5900dc', yAxis: 'left', type: 'area', decimal: true },
  buyBox: { label: 'Buybox', symbol: CURRENCY, color: '#f70cd0dc', yAxis: 'left', type: 'line', decimal: true },
};

export const OfferGraphKeys = {
  offerCount: { label: 'Offer Count', symbol: '', color: '#039BE5', yAxis: 'left', type: 'area', decimal: false },
};

//Icon Images
export const IconImages = {
  dimention: 'https://img.icons8.com/dusk/128/tesseract.png',
  google: 'https://img.icons8.com/fluency/96/google-logo.png',
  whiteAmzon: 'https://img.icons8.com/ios-filled/50/FFFFFF/amazon.png',
  amazon: 'https://img.icons8.com/color/96/amazon.png',
  sheets: 'https://img.icons8.com/fluency/96/google-sheets--v1.png',
};
