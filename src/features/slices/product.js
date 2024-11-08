// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import { addProduct, getAllProducts } from "../actions/product";



const initialState = {
  isLoading: false,
  productData: [],
  totalPages: 1,
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(addProduct.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.productData = action.payload.data;
        toast.success("Product Added Successfully", {
          position: "top-center",
        });
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong");
      })
      .addCase(getAllProducts.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.productData = action.payload?.data;
        state.totalPages = action.payload?.pagination?.totalPages || 1;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
      })
 
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = productSlice.actions;
export default productSlice.reducer;

// ================================================== THE END ==================================================
