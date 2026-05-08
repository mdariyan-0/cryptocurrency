import { createSlice } from "@reduxjs/toolkit";

const watchlistSlice = createSlice({
    name: "watchlist",
    reducers: {
        addToWatchlist: (state, action) => {
            if (!state.includes(action.payload)) {
                state.push(action.payload);
            }
        },
            removeFromWatchlist: (state, action) => {
                return state.filter((item) => item !== action.payload);
            }
    }
    ,initialState: []
})

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;

export default watchlistSlice.reducer;