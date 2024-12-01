import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  modals: {}, 
};

const modalSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.modals[action.payload] = true; 
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false; 
    },
    resetModals: (state) => {
      state.modals = {}; 
    },
  },
});

export const { openModal, closeModal, resetModals } = modalSlice.actions;

export default modalSlice.reducer;
