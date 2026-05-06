import {createSlice} from "@reduxjs/toolkit"

const currencySlice = createSlice({
    name : "currency",
    initialState : [],
    reducers : {
        addCurrency : (state, action)=>{
            let newState = action.payload
            
            return newState
        },
        clearCurrency : (state,action)=>{
            state = []
        }
    }
})

export const {addCurrency} = currencySlice.actions;

export default currencySlice.reducer;