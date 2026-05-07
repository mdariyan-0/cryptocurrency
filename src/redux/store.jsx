import {configureStore} from "@reduxjs/toolkit"
import dataSlice from "./slices/dataSlice"
import coinSlice from "./slices/coinSlice"
const store = configureStore({
    reducer : {
        data: dataSlice,
        coin: coinSlice
    }
})

export default store;