import {createSlice} from "@reduxjs/toolkit"

const dataSlice = createSlice({
    name : "data",
    initialState : [],
    reducers : {
        fillData : (state, action)=>{
            let newState = action.payload
            
            return newState
        },
        clearData : (state,action)=>{
            state = []
        }
    }
})

export const {fillData, clearData} = dataSlice.actions;

export default dataSlice.reducer;