// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import { addProduct, getAllProducts, getAllProductsByAdminId } from "../actions/product";
import { errorToast } from "../../utils/extra";



const initialState = {
  isLoading: false,
  productData: [],
  isSuccess: false,
  productDropdownData: [],
  totalPages: 1,
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(addProduct.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;

      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success("Product Added Successfully", {
          position: "top-center",
        });
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getAllProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productData = action.payload?.result || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(getAllProductsByAdminId.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAllProductsByAdminId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.productDropdownData = action.payload?.data;
      })
      .addCase(getAllProductsByAdminId.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
 
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {resetProductState} = productSlice.actions;
export default productSlice.reducer;

// ================================================== THE END ==================================================
