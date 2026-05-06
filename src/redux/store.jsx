import {configureStore} from "@reduxjs/toolkit"
import dataSlice from "./slices/dataSlice"
import currencySlice from "./slices/currencySlice"
const store = configureStore({
    reducer : {
        data: dataSlice,
        currency: currencySlice
    }
})

export default store;