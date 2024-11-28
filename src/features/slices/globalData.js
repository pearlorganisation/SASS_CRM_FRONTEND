// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import {
  createCustomOption,
  createGlobalData,
  deleteCustomOption,
  getCustomOptions,
  getDashboardCardsData,
  getDashboardPlansData,
  getDashboardRevenueData,
  getDashboardUsersData,
  getGlobalData,
} from "../actions/globalData";
import { errorToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  landingGlobalData: [],
  errorMessage: "",
  isSuccess: false,
  customOptions: [],
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
        toast.info(action.payload.data.message, {
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
        state.landingGlobalData = action.payload.data;
      })
      .addCase(getGlobalData.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })

      .addCase(getCustomOptions.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getCustomOptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.customOptions = action.payload?.data || [];
      })
      .addCase(getCustomOptions.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(createCustomOption.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(createCustomOption.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
      })
      .addCase(createCustomOption.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(deleteCustomOption.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(deleteCustomOption.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
      })
      .addCase(deleteCustomOption.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
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
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { toggleSidebar } = globalDataSlice.actions;
export default globalDataSlice.reducer;

// ================================================== THE END ==================================================
