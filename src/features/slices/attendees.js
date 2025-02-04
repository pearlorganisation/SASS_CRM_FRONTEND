// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import { errorToast, successToast } from "../../utils/extra";
import { getPullbacks } from "../actions/assign";
import {
  addAttendees,
  addEnrollment,
  swapAttendeeFields,
  getAttendee,
  getAttendeeLeadTypeByEmail,
  getAttendees,
  getEnrollments,
  getWebinarEnrollments,
  updateAttendee,
  updateAttendeeLeadType,
  fetchGroupedAttendees,
} from "../actions/attendees";

const initialState = {
  isLoading: false,
  isSuccess: false,
  selectedAttendee: [],
  attendeeData: [],
  attendeeEnrollments: [],
  webinarEnrollments: [],
  singleAttendeeData: null,
  totalPages: 1,
  errorMessage: "",
  tabValue: "preWebinar",
  attendeeLeadType: "",
  pagination: {},
  isSwapping: false,
};
// ---------------------------------------------------------------------------------------

export const attendeeSlice = createSlice({
  name: "attendee",
  initialState,
  reducers: {
    clearSuccess(state) {
      state.isSuccess = false;
    },
    clearAttendeeData(state) {
      state.attendeeData = [];
    },
    setTabValue(state, action) {
      state.tabValue = action.payload;
    },
    clearLeadType(state) {
      state.attendeeLeadType = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAttendees.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(addAttendees.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("attendees Added Successfully");
      })
      .addCase(addAttendees.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(updateAttendee.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateAttendee.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("attendees Updated Successfully");
      })
      .addCase(updateAttendee.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getAttendee.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedAttendee = action.payload || [];
      })
      .addCase(getAttendee.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getAttendees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendeeData = action.payload?.result || [];
        state.pagination = action.payload?.pagination || {};
      })

      .addCase(getAttendees.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getPullbacks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPullbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendeeData = action.payload || [];
      })

      .addCase(getPullbacks.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(updateAttendeeLeadType.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateAttendeeLeadType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Lead Type Updated Successfully");
      })
      .addCase(updateAttendeeLeadType.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getAttendeeLeadTypeByEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAttendeeLeadTypeByEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendeeLeadType = action.payload?.leadType || "";
      })
      .addCase(getAttendeeLeadTypeByEmail.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getEnrollments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEnrollments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendeeEnrollments = action?.payload?.result || [];
      })
      .addCase(getEnrollments.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })

      .addCase(getWebinarEnrollments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWebinarEnrollments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.webinarEnrollments = action?.payload?.result || [];
        state.totalPages = action?.payload?.totalPages || 1;
      })
      .addCase(getWebinarEnrollments.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })

      .addCase(addEnrollment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addEnrollment.fulfilled, (state, action) => {
        state.isLoading = false;
        successToast("Enrollment Added Successfully");
      })
      .addCase(addEnrollment.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(swapAttendeeFields.pending, (state) => {
        state.isSwapping = true;
        state.isSuccess = false;
      })

      .addCase(swapAttendeeFields.fulfilled, (state, action) => {
        state.isSwapping = false;
        state.isSuccess = true;
      })
      .addCase(swapAttendeeFields.rejected, (state, action) => {
        state.isSwapping = false;
        errorToast(action?.payload);  
      })
      .addCase(fetchGroupedAttendees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGroupedAttendees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendeeData = action?.payload?.data || [];
        state.pagination = action?.payload?.pagination || {};
      })
      .addCase(fetchGroupedAttendees.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { clearSuccess, setTabValue, clearLeadType, clearAttendeeData } =
  attendeeSlice.actions;
export default attendeeSlice.reducer;

// ================================================== THE END ==================================================
