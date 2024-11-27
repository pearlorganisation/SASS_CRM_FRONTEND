import { createSlice } from "@reduxjs/toolkit";
import {
  addPricePlans,
  deletePricePlan,
  getPricePlan,
  getPricePlans,
  updatePricePlans,
} from "../actions/pricePlan";
import { toast } from "sonner";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isPlanUpdated: false,
  isPlanDeleted: false,
  errorMessage: "",
  planData: null,
  singlePlanData: null,
};

const pricePlans = createSlice({
  name: "PricePlans",
  initialState,
  reducers: {},
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
        toast.error("Error On Plan Creation!", { position: "top-center" });
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
        toast.error("Error On Getting Plan!", { position: "top-center" });
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
        toast.error("Error On Getting Plan!", { position: "top-center" });
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
        toast.error("Error On Updating Plan!", { position: "top-center" });
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
        toast.error("Error On Deleting Plan!", { position: "top-center" });
      });
  },
});
export const {} = pricePlans.actions;
export default pricePlans.reducer;
