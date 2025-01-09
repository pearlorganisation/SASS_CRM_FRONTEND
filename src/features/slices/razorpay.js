// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import { errorToast, successToast } from "../../utils/extra";
import { checkout } from "../actions/razorpay";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isFormLoading: false,
  checkoutData: null,
  totalPages: 1,
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const razorpaySlice = createSlice({
  name: "razorpay",
  initialState,
  reducers: {
    resetRazorpaySuccess: (state) => {
      state.isSuccess = false;
    },
    resetRazorpayData: (state) => {
      state.checkoutData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.checkoutData = action.payload;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      });
  },
});

// --------------------------------------------------------------------
// Action creators are generated for each case reducer function
export const { resetRazorpayData, resetRazorpaySuccess } =
  razorpaySlice.actions;
export default razorpaySlice.reducer;

// ================================================== THE END ==============
