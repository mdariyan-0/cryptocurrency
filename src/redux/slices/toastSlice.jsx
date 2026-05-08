import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
    name: "toast",
    initialState: { show: false, message: "" },
    reducers: {
        showToast: (state, action) => {
            state.show = true;
            state.message = action.payload;
        },
        hideToast: (state) => {
            state.show = false;
            state.message = "";
        },
    },
});

export const { showToast, hideToast } = toastSlice.actions;

let toastTimeout = null;

export const displayToast = (message) => (dispatch) => {
    dispatch(showToast(message));

    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
        dispatch(hideToast());
    }, 2000); // Hides after 2 seconds
};

export default toastSlice.reducer;
