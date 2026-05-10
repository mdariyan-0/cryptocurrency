import { createSlice } from "@reduxjs/toolkit";

const searchSlice = createSlice({
  name: "searchList",
  initialState: [],
  reducers: {
    setSearchList: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSearchList } = searchSlice.actions;
export default searchSlice.reducer;
