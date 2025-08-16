import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  productsLoading: false,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductsLoading: (state, action) => {
      state.productsLoading = action.payload;
    },
  },
});

export const { setProducts, setProductsLoading } = productsSlice.actions;

export const productsReducer = productsSlice.reducer;
