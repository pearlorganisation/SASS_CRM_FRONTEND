import { createSlice } from "@reduxjs/toolkit";
import {
  addPricePlans,
  createAddon,
  deletePricePlan,
  getAddons,
  getClientAddons,
  getPricePlan,
  getPricePlans,
  updatePricePlans,
} from "../actions/pricePlan";
import { toast } from "sonner";
import { errorToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isPlanUpdated: false,
  isPlanDeleted: false,
  errorMessage: "",
  planData: null,
  singlePlanData: null,
  addonsData: []
};

const pricePlans = createSlice({
  name: "PricePlans",
  initialState,
  reducers: {
    resetPricePlanSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPricePlans.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(addPricePlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.planData = action.payload;
      })
      .addCase(addPricePlans.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isSuccess = false;
        errorToast("Error On Plan Creation!");
      })

      //get price plans

      .addCase(getPricePlans.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isPlanUpdated = false;
        state.isPlanDeleted = false;
        state.isSuccess = false;
      })
      .addCase(getPricePlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.planData = action.payload;
      })
      .addCase(getPricePlans.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast("Error On Getting Plan!");
      })
      .addCase(getPricePlan.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isPlanUpdated = false;
        state.isPlanDeleted = false;
        state.isSuccess = false;
      })
      .addCase(getPricePlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singlePlanData = action.payload;
      })
      .addCase(getPricePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast("Error On Getting Plan!");
      })

      //update price plans

      .addCase(updatePricePlans.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updatePricePlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isPlanUpdated = true;
        state.planData = action.payload;
        toast.success("Plan Updated Successfully!", { position: "top-center" });
      })
      .addCase(updatePricePlans.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isSuccess = false;
        errorToast("Error On Updating Plan!");
      })

      //delete price plans
      .addCase(deletePricePlan.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deletePricePlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isPlanDeleted = true;
        state.planData = action.payload;
        toast.success("Plan Deleted Successfully!", { position: "top-center" });
      })
      .addCase(deletePricePlan.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isSuccess = false;
        errorToast("Error On Deleting Plan!");
      })
      .addCase(createAddon.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createAddon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createAddon.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        errorToast("Error On Plan Creation!");
      })
      .addCase(getAddons.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAddons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addonsData = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAddons.rejected, (state, action) => {
        state.isLoading = false;
        errorToast("Error On Plan Creation!");
      })
      .addCase(getClientAddons.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getClientAddons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addonsData = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getClientAddons.rejected, (state, action) => {
        state.isLoading = false;
        errorToast("Error On Plan Creation!");
      });
  },
});
export const {resetPricePlanSuccess} = pricePlans.actions;
export default pricePlans.reducer;
