import { createSlice } from "@reduxjs/toolkit";

const coinSlice = createSlice({
  name: "coin",
  initialState: [],
  reducers: {
    addCoin: (state, action) => {
      return action.payload;
    },
    clearCoin: (state, action) => {
      return [];
    },
  },
});

export const { addCoin, clearCoin } = coinSlice.actions;

export default coinSlice.reducer;
