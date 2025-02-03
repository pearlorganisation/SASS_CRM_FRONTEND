import { createSlice } from "@reduxjs/toolkit";
import {
  addPricePlans,
  createAddon,
  deletePricePlan,
  getAddons,
  getAdminBillingHistory,
  getClientAddons,
  getPricePlan,
  getPricePlans,
  updatePlansOrder,
  updatePricePlans,
} from "../actions/pricePlan";
import { toast } from "sonner";
import { errorToast, successToast } from "../../utils/extra";
import { checkout } from "../actions/razorpay";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isPlanUpdated: false,
  isPlanDeleted: false,
  errorMessage: "",
  planData: [],
  singlePlanData: null,
  addonsData: [],
  billingHistory: [],
  totalPages: 1,
};

const pricePlans = createSlice({
  name: "PricePlans",
  initialState,
  reducers: {
    resetPricePlanSuccess: (state) => {
      state.isSuccess = false;
    },
    resetAddonsData: (state) => {
      state.addonsData = [];
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
        errorToast(action?.payload);
      })

      //get price plans

      .addCase(getPricePlans.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isPlanUpdated = false;
        state.isSuccess = false;
      })
      .addCase(getPricePlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.planData = action.payload;
      })
      .addCase(getPricePlans.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
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
        errorToast(action?.payload);
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
        errorToast(action?.payload);
      })

      //delete price plans
      .addCase(deletePricePlan.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deletePricePlan.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Plan Deleted Successfully!");
      })
      .addCase(deletePricePlan.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
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
        errorToast(action?.payload);
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
        errorToast(action?.payload);
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
        errorToast(action?.payload);
      })
      .addCase(getAdminBillingHistory.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAdminBillingHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.billingHistory = Array.isArray(action.payload?.data)
          ? action.payload.data
          : [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(getAdminBillingHistory.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(updatePlansOrder.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updatePlansOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Plan Order Updated Successfully!");
      })
      .addCase(updatePlansOrder.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(checkout.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.isLoading = false;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      });
  },
});
export const { resetPricePlanSuccess, resetAddonsData } = pricePlans.actions;
export default pricePlans.reducer;
