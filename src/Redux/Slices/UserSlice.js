'use client';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  userLoading: true,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      return state;
    },
    setLogout: (state) => {
      state.user = null;
      localStorage.removeItem('ProfitBuddyToken');
      state.userLoading = false;
      return state;
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
      return state;
    },
  },
});

export const { setUser, setLogout, setUserLoading } = userSlice.actions;

export const userReducer = userSlice.reducer;
