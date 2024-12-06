import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addPricePlans,
  getPricePlan,
  updatePricePlans,
} from "../../../features/actions/pricePlan";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
} from "@mui/material";
import FormInput from "../../../components/FormInput";

export default function AddPlan() {
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(id ? true : false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoading, planData, isSuccess, singlePlanData } = useSelector(
    (state) => state.pricePlans
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (isEditMode) {
      data["_id"] = id;
    }
    dispatch(isEditMode ? updatePricePlans(data) : addPricePlans(data));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/plans");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(getPricePlan(id));
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (isEditMode && singlePlanData) {

      reset({
        name: singlePlanData.name || "",
        amount: singlePlanData.amount || 0,
        planDuration: singlePlanData.planDuration || 0,
        employeeCount: singlePlanData.employeeCount || 0,
        contactLimit: singlePlanData.contactLimit || 0,
        toggleLimit: singlePlanData.toggleLimit || 0,
      })
    }
  }, [singlePlanData, isEditMode]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-2">
      <Box className="max-w-4xl w-full bg-white shadow-md rounded-lg">
        <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <Typography variant="h6" className="font-semibold text-gray-800">
            {isEditMode ? "Edit Price Plan" : "Add Price Plan"}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput
              name="name"
              label="Plan Name"
              control={control}
              required={true}
              errorMessage="Plan name is required"
            />
            <FormInput
              name="amount"
              label="Price"
              type="number"
              control={control}
              required={true}
              errorMessage="Price is required"
            />
            <FormInput
              name="planDuration"
              label="Plan Expiry (days)"
              type="number"
              control={control}
              required={true}
              errorMessage="Plan expiry is required"
            />
            <FormInput
              name="employeeCount"
              label="Employees Count"
              type="number"
              control={control}
              required={true}
              errorMessage="Employee count is required"
            />
            <FormInput
              name="contactLimit"
              label="Contact Limit"
              type="number"
              control={control}
              required={true}
              errorMessage="Contact limit is required"
            />

            <FormInput
              name="toggleLimit"
              label="Toggle Limit"
              type="number"
              control={control}
              required={true}
              errorMessage="Toggle limit is required"
            />
          </div>
          <Box className="mt-6">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              className="py-2 text-sm font-medium"
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                "Update Plan"
              ) : (
                "Add Plan"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
}
