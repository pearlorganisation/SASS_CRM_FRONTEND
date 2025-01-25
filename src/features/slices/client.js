// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";

import {
  getAllClients,
  getClientById,
  clientSignup,
  updateClient,
  getAllClientsForDropdown,
} from "../actions/client";
import { errorToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  isUpdating: false,
  isSuccess: false,
  totalPages: null,
  errorMessage: "",
  clientsData: [],
  singleClientData: null,
  clientsDropdownData: [],
};

// ---------------------------------------------------------------------------------------

export const clientSlce = createSlice({
  name: "client",
  initialState,
  reducers: {
    resetClientState: (state) => {
      state.isSuccess = false;
    },
  },
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
        state.isUpdating = true;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.isSuccess = true;
        toast.success(`Client Updated Successfully`, {
          position: "top-center",
        });
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isUpdating = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(getAllClientsForDropdown.fulfilled, (state, action) => {
        state.clientsDropdownData = Array.isArray(action.payload)? action.payload : [];
      })
      .addCase(getAllClientsForDropdown.rejected, (state, action) => {
        errorToast(action?.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {resetClientState} = clientSlce.actions;
export default clientSlce.reducer;

// ================================================== THE END ==================================================
