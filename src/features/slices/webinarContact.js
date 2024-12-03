// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import {
  addWebinarContacts,
  deleteWebinarContacts,
  getAllAttendees,
  getAttendees,
  getAllWebinars,
  getAllAssignments,
  getAttendeeContactDetails,
  updateAttendeeDetails,
  updateAttendeeLeadType,
  createWebinar,
  updateWebinar,
  deleteWebinar,
} from "../actions/webinarContact";
import { errorToast, successToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  webinarData: [],
  attendeeData: [],
  assignmentData: [],
  attendeeContactDetails: null,
  totalPages: null,
  isSuccess: false,
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const webinarContactSlice = createSlice({
  name: "webinarContact",
  initialState,
  reducers: {
    resetAttendeeContactDetails: (state) => {
      state.attendeeContactDetails = null;
    },
  },
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
        errorToast(action?.payload);
      })
      .addCase(updateAttendeeDetails.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(updateAttendeeDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
      })
      .addCase(updateAttendeeDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
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
        state.attendeeData = [];
        errorToast(action?.payload);
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
        errorToast(action?.payload);
      })
      .addCase(getAllWebinars.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAllWebinars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.webinarData = action.payload;
        state.totalPages = 1;
      })
      .addCase(getAllWebinars.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(createWebinar.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isSuccess = false;
      })
      .addCase(createWebinar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.isSuccess = true;
        successToast("Webinar Created Successfully");
      })
      .addCase(createWebinar.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(updateWebinar.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isSuccess = false;
      })
      .addCase(updateWebinar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.isSuccess = true;
        successToast("Webinar Updated Successfully");
      })
      .addCase(updateWebinar.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(deleteWebinarContacts.pending, (state, action) => {
        state.isLoading = true;
        state.isDeleted = false;
        state.errorMessage = "";
      })
      .addCase(deleteWebinarContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDeleted = true;
        state.errorMessage = "";
      })
      .addCase(deleteWebinarContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.isDeleted = false;
        errorToast(action?.payload);
      })
      .addCase(deleteWebinar.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteWebinar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteWebinar.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getAllAssignments.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAllAssignments.fulfilled, (state, action) => {
        console.log(action.payload.data);
        state.isLoading = false;
        state.errorMessage = "";
        state.assignmentData = action.payload?.data || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getAllAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.assignmentData = [];
        errorToast(action?.payload);
      })
      .addCase(getAttendeeContactDetails.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAttendeeContactDetails.fulfilled, (state, action) => {
        console.log(action.payload.data);
        state.isLoading = false;
        state.errorMessage = "";
        state.attendeeContactDetails = action.payload;
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getAttendeeContactDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.assignmentData = [];
        errorToast(action?.payload);
      })
      .addCase(updateAttendeeLeadType.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(updateAttendeeLeadType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        toast.success("Lead Type Updated Successfully", {
          position: "top-center",
        });
      })
      .addCase(updateAttendeeLeadType.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { resetAttendeeContactDetails } = webinarContactSlice.actions;
export default webinarContactSlice.reducer;

// ================================================== THE END ==================================================
