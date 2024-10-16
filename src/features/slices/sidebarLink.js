// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import { addSidebarLink, getAllSidebarLinks } from "../actions/sidebarLink";




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
        toast.error(action?.payload || "Something went wrong");
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
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
      })
 
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = sidebarLinkSlice.actions;
export default sidebarLinkSlice.reducer;

// ================================================== THE END ==================================================
