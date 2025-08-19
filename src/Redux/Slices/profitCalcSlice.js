import { createSlice } from '@reduxjs/toolkit';
import { calculateTotalFees, calculateMaxCost, calculateProfitAndROI } from '../../Utils/CalculationUtils';

const initialState = {
  product: null,
  buyCost: 1,
  sellPrice: 0,
  storageMonth: 0,
  fulfillment: 'FBA',

  // derived values
  fees: null,
  maxCost: 0,
  profit: 0,
  roi: 0,
};

const profitCalcSlice = createSlice({
  name: 'profitCalc',
  initialState,
  reducers: {
    setProduct(state, action) {
      const product = action.payload;
      state.product = product;
      state.sellPrice = product?.info?.sellPrice ?? 0;
      state.buyCost = 1;
      profitCalcSlice.caseReducers.recalculate(state);
    },
    setBuyCost(state, action) {
      state.buyCost = Number(action.payload) || 0;
      profitCalcSlice.caseReducers.recalculate(state);
    },
    setSellPrice(state, action) {
      state.sellPrice = Number(action.payload) || 0;
      profitCalcSlice.caseReducers.recalculate(state);
    },
    setStorageMonth(state, action) {
      state.storageMonth = action.payload;
      profitCalcSlice.caseReducers.recalculate(state);
    },
    setFulfillment(state, action) {
      state.fulfillment = action.payload;
      profitCalcSlice.caseReducers.recalculate(state);
    },

    // place to recalc all derived values
    recalculate(state) {
      const fees = calculateTotalFees(state.product, state.sellPrice, state.storageMonth, state.fulfillment === 'FBA');
      state.fees = fees;

      state.maxCost = calculateMaxCost(state.sellPrice, fees?.totalFees);

      const { profit, roi } = calculateProfitAndROI(fees?.totalFees, state.sellPrice, state.buyCost);

      state.profit = profit;
      state.roi = roi;
    },
  },
});

export const { setProduct, setBuyCost, setSellPrice, setStorageMonth, setFulfillment, recalculate } = profitCalcSlice.actions;

export const profitCalcReducer = profitCalcSlice.reducer;
