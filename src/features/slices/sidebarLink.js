// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import { addSidebarLink, deleteSidebarLink, getAllSidebarLinks } from "../actions/sidebarLink";
import { errorToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  sidebarLinkData: [],
  totalPages: null,
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const sidebarLinkSlice = createSlice({
  name: "sidebarLink",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(addSidebarLink.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(addSidebarLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.sidebarLinkData = action.payload.data;
        toast.success("Link Added Successfully", {
          position: "top-center",
        });
      })
      .addCase(addSidebarLink.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        console.log('its madafaka console',action.payload);
   
        errorToast(action.payload);
      })
      .addCase(getAllSidebarLinks.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAllSidebarLinks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.sidebarLinkData = action.payload;
      })
      .addCase(getAllSidebarLinks.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action.payload);
      })
      .addCase(deleteSidebarLink.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(deleteSidebarLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
      })
      .addCase(deleteSidebarLink.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = sidebarLinkSlice.actions;
export default sidebarLinkSlice.reducer;

// ================================================== THE END ==================================================
