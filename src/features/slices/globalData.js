// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import { createGlobalData, getGlobalData } from "../actions/globalData";


const initialState = {
  isLoading: false,
  landingGlobalData: [],
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

      .addCase(createGlobalData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(createGlobalData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        toast.info(action.payload.data.message, {
          position: "top-center",
        });
      })
      .addCase(createGlobalData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong");
      })
      .addCase(getGlobalData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getGlobalData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.landingGlobalData = action.payload.data;
      })
      .addCase(getGlobalData.rejected, (state, action) => {
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
