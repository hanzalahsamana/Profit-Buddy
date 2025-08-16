import { combineReducers } from '@reduxjs/toolkit';
import { productsReducer } from './Slices/ProductSlice';
import { systemReducer } from './Slices/SystemSlice';

const rootReducer = combineReducers({
  products: productsReducer,
  system: systemReducer,
});

export default rootReducer;
