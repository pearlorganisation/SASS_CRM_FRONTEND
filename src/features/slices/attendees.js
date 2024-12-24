// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import { errorToast, successToast } from "../../utils/extra";
import { getPullbacks } from "../actions/assign";
import { addAttendees, getAllAttendees, getAttendee, getAttendeeLeadTypeByEmail, getAttendees, updateAttendee, updateAttendeeLeadType } from "../actions/attendees";

const initialState = {
  isLoading: false,
  isSuccess: false,
  selectedAttendee: [],
  attendeeData: [],
  singleAttendeeData: null,
  totalPages: 1,
  errorMessage: "",
  tabValue: "preWebinar",
  attendeeLeadType: '',
};
// ---------------------------------------------------------------------------------------

export const attendeeSlice = createSlice({
  name: "attendee",
  initialState,
  reducers: {
    clearSuccess(state) {
      state.isSuccess = false;
    },
    setTabValue(state, action) {
      state.tabValue = action.payload;
    },
    clearLeadType(state) {
      console.log('clearLeadType');
      state.attendeeLeadType = '';  }
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
        state.totalPages = action.payload?.totalPages || 1;
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
      .addCase(getAllAttendees.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAttendees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.attendeeData = action.payload?.result || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getAllAttendees.rejected, (state, action) => {
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
        console.log('action.payload?.leadType', action.payload?.leadType);
        state.attendeeLeadType = action.payload?.leadType || '';
      })
      .addCase(getAttendeeLeadTypeByEmail.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { clearSuccess, setTabValue, clearLeadType } = attendeeSlice.actions;
export default attendeeSlice.reducer;

// ================================================== THE END ==================================================
