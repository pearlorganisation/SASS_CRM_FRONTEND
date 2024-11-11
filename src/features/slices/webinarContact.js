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
  updateWebinarContacts,
} from "../actions/webinarContact";

const initialState = {
  isLoading: false,
  webinarData: [],
  attendeeData: [],
  assignmentData: [],
  attendeeContactDetails: null,
  totalPages: null,
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
        toast.error(action?.payload || "Something went wrong");
      })
      .addCase(updateWebinarContacts.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(updateWebinarContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.webinarData = action.payload.data;
        toast.success("Webinar Attendees Updated Successfully", {
          position: "top-center",
        });
      })
      .addCase(updateWebinarContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong");
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
        state.attendeeData = [];
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
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
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
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
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
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
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
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { resetAttendeeContactDetails } = webinarContactSlice.actions;
export default webinarContactSlice.reducer;

// ================================================== THE END ==================================================
