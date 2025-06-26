import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    add: (state, action) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
    },
    remove: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clear: (state) => {
      state.items = [];
    },
  },
});

export const { add, remove, clear } = wishlistSlice.actions;
export default wishlistSlice.reducer;