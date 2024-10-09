// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import {
  addWebinarContacts,
  deleteWebinarContacts,
  getAllAttendees,
  getAttendees,
  getAllWebinars,
} from "../actions/webinarContact";

const initialState = {
  isLoading: false,
  webinarData: [],
  attendeeData: [],
  totalPages: null,
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const webinarContactSlice = createSlice({
  name: "webinarContact",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(addWebinarContacts.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(addWebinarContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.webinarData = action.payload.data;
        toast.success("Webinar Attendees Added Successfully", {
          position: "top-center",
        });
      })
      .addCase(addWebinarContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong");
      })
      .addCase(getAllAttendees.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAllAttendees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.attendeeData = action.payload;
      })
      .addCase(getAllAttendees.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
      })
      .addCase(getAttendees.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAttendees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.attendeeData = action.payload;
      })
      .addCase(getAttendees.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
      })
      .addCase(getAllWebinars.pending, (state, action) => {
        state.isLoading = true;
state.errorMessage = "";
      })
      .addCase(getAllWebinars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.webinarData = action.payload.data;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAllWebinars.rejected, (state, action) => {
        state.isLoading = false;
    
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
      })
      .addCase(deleteWebinarContacts.pending, (state, action) => {
        state.isLoading = true;
        state.isDeleted=false;
        state.errorMessage = "";
      })
      .addCase(deleteWebinarContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDeleted=true;
        state.errorMessage = "";
      })
      .addCase(deleteWebinarContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isDeleted=false;
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = webinarContactSlice.actions;
export default webinarContactSlice.reducer;

// ================================================== THE END ==================================================
