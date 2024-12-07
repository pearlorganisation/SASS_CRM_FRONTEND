import { createSlice } from "@reduxjs/toolkit";
import { errorToast, successToast } from "../../utils/extra";
import { creattFilterPreset, deleteFilterPreset, getFilterPreset } from "../actions/filter-preset";
// -------------------------------------------------------------------------------------------

const initialState = {
  isLoading: false,
  errorMessage: "",
  isSuccess: false,
  singleFilterPreset: null,
  filterPresets: [],
};

// -------------------------------------- Slices------------------------------------------------
const filterPresetSlice = createSlice({
  name: "filterPreset",
  initialState,
  reducers: {
    clearPreset: (state) => {
      console.log('clearing preset');
      state.singleFilterPreset = null;
      state.filterPresets = [];
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // signUp lifecycle methods
      .addCase(creattFilterPreset.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(creattFilterPreset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Filter Preset Created Successfully");
      })
      .addCase(creattFilterPreset.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      })
      .addCase(deleteFilterPreset.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteFilterPreset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Filter Preset Deleted Successfully");
      })
      .addCase(deleteFilterPreset.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      })
      .addCase(getFilterPreset.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getFilterPreset.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filterPresets = action.payload || [];
      })
      .addCase(getFilterPreset.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      });
  },
});

export default filterPresetSlice.reducer;
export const { clearPreset } = filterPresetSlice.actions;
