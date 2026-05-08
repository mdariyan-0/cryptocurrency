import {configureStore} from "@reduxjs/toolkit"
import dataSlice from "./slices/dataSlice"
import coinSlice from "./slices/coinSlice"
import watchlistSlice from "./slices/watchlistSlice"
import toastSlice from "./slices/toastSlice"
import nameSlice from "./slices/nameSlice"
const store = configureStore({
    reducer : {
        data: dataSlice,
        coin: coinSlice,
        watchlist: watchlistSlice,
        toast: toastSlice,
        names: nameSlice,
    }
})

export default store;