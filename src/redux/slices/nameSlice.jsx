import { createSlice } from "@reduxjs/toolkit";

const nameSlice = createSlice({
  name: "names",
  initialState: [],
  reducers: {
    setNames: (state, action) => {
      return action.payload;
    },
  },
});

export const { setNames } = nameSlice.actions;

export default nameSlice.reducer;
