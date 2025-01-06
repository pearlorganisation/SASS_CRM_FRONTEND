// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import {
  createCustomOption,
  createGlobalData,
  deleteCustomOption,
  getDashboardData,
  getCustomOptions,
  getDashboardCardsData,
  getDashboardPlansData,
  getDashboardRevenueData,
  getDashboardUsersData,
  getGlobalData,
  getCustomOptionsForFilters,
  deleteAllData,
} from "../actions/globalData";
import { errorToast, successToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  landingGlobalData: [],
  errorMessage: "",
  isSuccess: false,
  customOptions: [],
  customOptionsForFilters: [],
  isSidebarOpen: false,
  dashBoardCardsData: {},
  plansGraphData: [],
  usersGraphData: [],
  revenueGraphData: [],
};

// ---------------------------------------------------------------------------------------

export const globalDataSlice = createSlice({
  name: "globalData",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(createGlobalData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(createGlobalData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        toast.success("Landing Page Data Updated Successfully", {
          position: "top-center",
        });
      })
      .addCase(createGlobalData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(getGlobalData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getGlobalData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.landingGlobalData = action.payload;
      })
      .addCase(getGlobalData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      .addCase(getCustomOptions.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCustomOptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOptions = action.payload || [];
      })
      .addCase(getCustomOptions.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getCustomOptionsForFilters.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCustomOptionsForFilters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customOptionsForFilters = action.payload || [];
      })
      .addCase(getCustomOptionsForFilters.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(createCustomOption.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(createCustomOption.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Option Created Successfully");
      })
      .addCase(createCustomOption.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(deleteCustomOption.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteCustomOption.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Option Deleted Successfully");
      })
      .addCase(deleteCustomOption.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getDashboardCardsData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getDashboardCardsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.dashBoardCardsData =
          Array.isArray(action.payload) && action.payload.length > 0
            ? action.payload[0]
            : {};
      })
      .addCase(getDashboardCardsData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      .addCase(getDashboardData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.dashBoardCardsData = action.payload;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      .addCase(getDashboardPlansData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getDashboardPlansData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.plansGraphData = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getDashboardPlansData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(getDashboardUsersData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getDashboardUsersData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.usersGraphData = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getDashboardUsersData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(getDashboardRevenueData.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getDashboardRevenueData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.revenueGraphData = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(getDashboardRevenueData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      .addCase(deleteAllData.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteAllData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Data Deleted Successfully");
      })
      .addCase(deleteAllData.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { toggleSidebar } = globalDataSlice.actions;
export default globalDataSlice.reducer;

// ================================================== THE END ==================================================
