import { createSlice } from "@reduxjs/toolkit";
import {
  deleteUserDocumet,
  generateOTP,
  getAllRoles,
  getCurrentUser,
  getSuperAdmin,
  getUserSubscription,
  logIn,
  signUp,
  updatePassword,
  updateUser,
  updateWhatsappToken,
  validateOTP,
} from "../actions/auth";
import { toast } from "sonner";
import { errorToast, successToast } from "../../utils/extra";
import { socket } from "../../socket";
// -------------------------------------------------------------------------------------------

// initialState -- initial state of authentication
const initialState = {
  isLoading: false,
  errorMessage: "",
  isUserLoggedIn: false,
  userData: null,
  isSuccess: false,
  isOTPGenerated: false,
  isRolesLoading: false,
  roles: [],
  subscription: null,
  superAdminData: null,
  isSomethingStillLoading: false,
};

// -------------------------------------- Slices------------------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      socket.disconnect();
      state.isUserLoggedIn = false;
      state.userData = null;
      state.subscription = null;
    },
    clearLoadingAndData: (state) => {
      (state.isLoading = false), (state.userData = null);
    },
    clearOTPGenerated: (state) => {
      state.isOTPGenerated = false;
      state.isSuccess = false;
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
      })
      .addCase(getUserSubscription.fulfilled, (state, action) => {
        state.subscription = action.payload;
      })
      .addCase(getUserSubscription.rejected, (state, action) => {
        errorToast(action?.payload || "Error getting user subscription");
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        if (!state.userData) state.userData = action.payload?.data;
      })
      .addCase(deleteUserDocumet.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteUserDocumet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.isSuccess = true;
        successToast("User Deleted Successfully");
      })
      .addCase(deleteUserDocumet.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getSuperAdmin.fulfilled, (state, action) => {
        state.superAdminData = action.payload || null;
      })
      .addCase(generateOTP.pending, (state, action) => {
        state.isSomethingStillLoading = true;
        state.isOTPGenerated = false;
      })
      .addCase(generateOTP.fulfilled, (state, action) => {
        state.isSomethingStillLoading = false;
        state.isOTPGenerated = true;
        successToast("OTP Generated Successfully");
      })
      .addCase(generateOTP.rejected, (state, action) => {
        state.isSomethingStillLoading = false;
        errorToast(action?.payload);
      })
      .addCase(validateOTP.pending, (state, action) => {
        state.isSomethingStillLoading = true;
        state.isSuccess = false;
      })

      .addCase(validateOTP.fulfilled, (state, action) => {
        state.isSomethingStillLoading = false;
        state.isSuccess = true;
        successToast(
          "OTP Validated Successfully! A new password has been sent to your email. Please check your mail and reset your password."
        );
      })
      .addCase(validateOTP.rejected, (state, action) => {
        state.isSomethingStillLoading = false;
        errorToast(action?.payload);
      })
      .addCase(updateWhatsappToken.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateWhatsappToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Whatsapp Token Updated Successfully");
      })
      .addCase(updateWhatsappToken.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      });
  },
});

// ===========================================Exports==================================================
export default authSlice.reducer;
export const { logout, clearLoadingAndData, clearOTPGenerated } =
  authSlice.actions;
