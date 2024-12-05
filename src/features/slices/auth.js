import { createSlice } from "@reduxjs/toolkit";
import { getAllRoles, logIn, signUp, updatePassword, updateUser } from "../actions/auth";
import { toast } from "sonner";
import { errorToast } from "../../utils/extra";
// -------------------------------------------------------------------------------------------

// initialState -- initial state of authentication
const initialState = {
  isLoading: false,
  errorMessage: "",
  isUserLoggedIn: false,
  userData: null,
  isSuccess: false,
  isRolesLoading: false,
  roles: [],
};

// -------------------------------------- Slices------------------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isUserLoggedIn = false;
    },
    clearLoadingAndData: (state) => {
      (state.isLoading = false), (state.userData = null);
    },
  },
  extraReducers: (builder) => {
    builder

      // signUp lifecycle methods
      .addCase(signUp.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.data;
        toast.success(`New Account Created Successfully`, {
          position: "top-center",
        });
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })

      // Login cases
      .addCase(logIn.pending, (state, action) => {
        state.isLoading = true;
        state.isUserLoggedIn = false;
        state.errorMessage = "";
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUserLoggedIn = true;
        console.log("fulfilled", action.payload);
        state.userData = action.payload;
        toast.success(`Login Successfully`, {
          position: "top-center",
        });
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isUserLoggedIn = false;
        state.errorMessage = action.payload;
        console.log(" ---- > ", action.payload);
        errorToast(action?.payload);
      })
      // Login cases
      .addCase(updateUser.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isSuccess = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.isSuccess = true;
        toast.success(`User Updated Successfully`, {
          position: "top-center",
        });
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(updatePassword.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
        state.isSuccess = false;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success(`User Password Updated Successfully`, {
          position: "top-center",
        });
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(getAllRoles.pending, (state, action) => {
        state.isRolesLoading = true;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.isRolesLoading = false;
        state.roles = action.payload;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.isRolesLoading = false;
      });

  },
});

// ===========================================Exports==================================================
export default authSlice.reducer;
export const { logout, clearLoadingAndData } = authSlice.actions;
