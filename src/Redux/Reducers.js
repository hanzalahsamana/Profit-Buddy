import { combineReducers } from '@reduxjs/toolkit';
import { productsReducer } from './Slices/ProductSlice';
import { systemReducer } from './Slices/SystemSlice';
import { profitCalcReducer } from './Slices/profitCalcSlice';

const rootReducer = combineReducers({
  products: productsReducer,
  system: systemReducer,
  profitCalc: profitCalcReducer,
});

export default rootReducer;
