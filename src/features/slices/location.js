// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import { errorToast, successToast } from "../../utils/extra";
import { getLocations } from "../actions/location";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isFormLoading: false,
  locationsData: [],
  locationRequests: [],
  totalPages: 1,
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    resetLocationSuccess: (state) => {
      state.isSuccess = false;
    },
    resetLocationData: (state) => {
      state.locationsData = [];
      state.locationRequests=[]
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocations.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getLocations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.locationsData = action.payload     
        successToast('Locations fetched.')   
      })
      .addCase(getLocations.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
  },
});

// --------------------------------------------------------------------
// Action creators are generated for each case reducer function
export const { resetLocationData, resetLocationSuccess } = locationSlice.actions;
export default locationSlice.reducer;

// ================================================== THE END ==============
