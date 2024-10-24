import { createSlice } from "@reduxjs/toolkit";
import { logIn, signUp } from "../actions/auth";
import { toast } from "sonner";
// -------------------------------------------------------------------------------------------

// initialState -- initial state of authentication
const initialState = {
  isLoading: false,
  errorMessage: "",
  isUserLoggedIn: false,
  userData:[],
};

// -------------------------------------- Slices------------------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
   logout : (state)=>{
    state.isUserLoggedIn = false},
   clearLoadingAndData : (state) =>
   { state.isLoading = false,
    state.userData= []
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
      toast.error(action?.payload || "Something went wrong");
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
        state.userData= action.payload.user
        toast.success(`Login Successfull`, {
            position: "top-center",
          });
      })
      .addCase(logIn.rejected, (state, action) => {
        state.isLoading = false;
        state.isUserLoggedIn = false;
        state.errorMessage = action.payload;
        console.log(action.payload)
        toast.error(action?.payload || "Something went wrong");
      })
  },
});

// ===========================================Exports==================================================
export default authSlice.reducer;
export const {
    logout,clearLoadingAndData
} = authSlice.actions;
