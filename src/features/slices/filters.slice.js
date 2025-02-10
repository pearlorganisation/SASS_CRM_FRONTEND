import { createSlice } from "@reduxjs/toolkit";
import {
  allAttendeesSortByOptions,
  webinarAttendeesSortByOptions,
} from "../../utils/columnData";
// -------------------------------------------------------------------------------------------

const initialState = {
  allAttendeesFilters: {},
  allAttendeesSortBy: {
    sortBy: allAttendeesSortByOptions[0].value,
    sortOrder: "asc",
  },
  webinarAttendeesFilters: {},
  webinarAttendeesSortBy: {
    sortBy: webinarAttendeesSortByOptions[0].value,
    sortOrder: "asc",
  },
};

// -------------------------------------- Slices------------------------------------------------
const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setAllAttendeesFilters: (state, action) => {
      if (action.payload) {
        state.allAttendeesFilters = action.payload.filters;
        state.allAttendeesSortBy = action.payload.sortBy;
      } else {
        state.allAttendeesFilters = {};
        state.allAttendeesSortBy = {
          sortBy: allAttendeesSortByOptions[0].value,
          sortOrder: "asc",
        };
      }
    },

    setWebinarAttendeesFilters: (state, action) => {
      if (action.payload) {
        state.webinarAttendeesFilters = action.payload.filters;
        state.webinarAttendeesSortBy = action.payload.sortBy;
      } else {
        state.webinarAttendeesFilters = {};
        state.webinarAttendeesSortBy = {
          sortBy: webinarAttendeesSortByOptions[0].value,
          sortOrder: "asc",
        };
      }
    },
  },
});

// ===========================================Exports==================================================

export default filtersSlice.reducer;
export const { setAllAttendeesFilters, setWebinarAttendeesFilters } =
  filtersSlice.actions;
