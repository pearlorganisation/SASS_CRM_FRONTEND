// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";

import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsByAdminId,
  getProductLevelCounts,
  getEnrollmentsByProductLevel,
  updateProduct,
} from "../actions/product";
import { errorToast, successToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  productData: [],
  isSuccess: false,
  productDropdownData: [],
  totalPages: 1,
  errorMessage: "",
  productLevelCounts: [],
  enrollmentsByProductLevel: [],
};

// ---------------------------------------------------------------------------------------

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearEnrollmentsByProductLevel: (state) => {
      state.enrollmentsByProductLevel = [];
    },
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

      .addCase(updateProduct.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success("Product updated Successfully", {
          position: "top-center",
        });
      })
      .addCase(updateProduct.rejected, (state, action) => {
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
        state.productDropdownData = action.payload;
      })
      .addCase(getAllProductsByAdminId.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })

      .addCase(deleteProduct.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        successToast(action?.payload?.data);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })

      .addCase(getProductLevelCounts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getProductLevelCounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productLevelCounts = action.payload;
      })
      .addCase(getProductLevelCounts.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })

      .addCase(getEnrollmentsByProductLevel.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getEnrollmentsByProductLevel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.enrollmentsByProductLevel = action.payload;
      })
      .addCase(getEnrollmentsByProductLevel.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { resetProductState, clearEnrollmentsByProductLevel } = productSlice.actions;
export default productSlice.reducer;

// ================================================== THE END ==================================================
