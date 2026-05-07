import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {},
  reducers: {
    fillData: (state, action) => {
      return action.payload;
    },
    updateCoins: (state, action) => {
      action.payload
        .filter((e) => e.s.endsWith("USDT"))
        .forEach((e) => {
          state[e.s] = {
            ...state[e.s],

            lastPrice: Number(e.c),

            quoteVolume: Number(e.q),

            priceChange: Number(e.c) - Number(e.o),

            priceChangePercent:
              ((Number(e.c) - Number(e.o)) / Number(e.o)) * 100,

            highPrice: Number(e.h),

            lowPrice: Number(e.l),
          };
        });
    },
    clearData: (state, action) => {
      return {};
    },
  },
});

export const { fillData, updateCoins, clearData } = dataSlice.actions;

export default dataSlice.reducer;
