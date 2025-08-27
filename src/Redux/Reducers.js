import { combineReducers } from '@reduxjs/toolkit';
import { productsReducer } from './Slices/ProductSlice';
import { systemReducer } from './Slices/SystemSlice';
import { profitCalcReducer } from './Slices/profitCalcSlice';
import { sellerReducer } from './Slices/SellerSlice';

const rootReducer = combineReducers({
  products: productsReducer,
  system: systemReducer,
  profitCalc: profitCalcReducer,
  seller: sellerReducer,
});

export default rootReducer;
