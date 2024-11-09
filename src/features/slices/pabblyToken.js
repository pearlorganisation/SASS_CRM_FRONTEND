// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import { getPabblyToken } from "../actions/pabblyToken";


const initialState = {
  isLoading: false,
pabblyTokenData: [],
  errorMessage: "",
  isSuccess: false
};

// ---------------------------------------------------------------------------------------

export const globalDataSlice = createSlice({
  name: "globalData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPabblyToken.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getPabblyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.pabblyTokenData = action.payload.data;
      })
      .addCase(getPabblyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
     
 
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = globalDataSlice.actions;
export default globalDataSlice.reducer;

// ================================================== THE END ==================================================
