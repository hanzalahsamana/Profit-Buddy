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
      state.currUser = action.payload;
      return state;
    },
    setLogout: (state) => {
      state.currUser = null;
      localStorage.removeItem('userToken');
      state.loading = false;
      return state;
    },
    setUserLoading: (state, action) => {
      state.loading = action.payload;
      return state;
    },
  },
});

export const { setUser, setLogout, setUserLoading } = userSlice.actions;

export const userReducer = userSlice.reducer;
