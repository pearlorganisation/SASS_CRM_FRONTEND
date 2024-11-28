// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";

import {
  getAllClients,
  getClientById,
  clientSignup,
  updateClient,
} from "../actions/client";
import { errorToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  totalPages: null,
  errorMessage: "",
  clientsData: [],
  singleClientData: null,
};

// ---------------------------------------------------------------------------------------

export const clientSlce = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllClients.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.clientsData = action.payload?.result || [];
        state.totalPages = action.payload?.totalPages;
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(getClientById.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getClientById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.singleClientData = action.payload;
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(clientSignup.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(clientSignup.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(`New Client Account Created Successfully`, {
          position: "top-center",
        });
      })
      .addCase(clientSignup.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(updateClient.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isLoading = false;
        toast.success(`Client Updated Successfully`, {
          position: "top-center",
        });
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = clientSlce.actions;
export default clientSlce.reducer;

// ================================================== THE END ==================================================
