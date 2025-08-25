import { createSlice } from '@reduxjs/toolkit';
import { calculateTotalFees, calculateMaxCost, calculateProfitAndROI } from '../../Utils/CalculationUtils';
import { PLACEMENT_FEE_TYPES } from '../../Enums/Enums';

const initialState = {
  product: null,
  buyCost: 0,
  sellPrice: 0,
  storageMonth: 0,
  fulfillment: 'FBA',
  placementFeeType: PLACEMENT_FEE_TYPES[0], // minimal , partial , optimized

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
      state.buyCost = 0;
      profitCalcSlice.caseReducers.recalculate(state);
    },
    setBuyCost(state, action) {
      const val = action.payload;
      if (val === '') {
        state.buyCost = '';
      } else {
        const num = Number(val);
        state.buyCost = num < 0 ? 0 : num; // clamp at 0
      }
      profitCalcSlice.caseReducers.recalculate(state);
    },

    setSellPrice(state, action) {
      const val = action.payload;
      if (val === '') {
        state.sellPrice = '';
      } else {
        const num = Number(val);
        state.sellPrice = num < 0 ? 0 : num; // clamp at 0
      }
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

    setPlacementFeeType(state, action) {
      if (!PLACEMENT_FEE_TYPES.includes(action.payload)) return;
      state.placementFeeType = action.payload;
      profitCalcSlice.caseReducers.recalculate(state);
    },

    // place to recalc all derived values
    recalculate(state) {
      const fees = calculateTotalFees(state.product, state.sellPrice, state.storageMonth, state.fulfillment === 'FBA', state.placementFeeType);
      state.fees = fees;

      state.maxCost = calculateMaxCost(state.sellPrice, fees?.totalFees);

      const { profit, roi } = calculateProfitAndROI(fees?.totalFees, state.sellPrice, state.buyCost);

      state.profit = profit;
      state.roi = roi;
    },
  },
});

export const { setProduct, setBuyCost, setSellPrice, setStorageMonth, setFulfillment, recalculate, setPlacementFeeType } = profitCalcSlice.actions;

export const profitCalcReducer = profitCalcSlice.reducer;
