import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  productsLoading: false,
  currentPage: 0,
  searchTerm: '',
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = [...state.products, ...action.payload];
    },
    setProductsLoading: (state, action) => {
      state.productsLoading = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setProducts, setProductsLoading, setCurrentPage  ,setSearchTerm} = productsSlice.actions;

export const productsReducer = productsSlice.reducer;
