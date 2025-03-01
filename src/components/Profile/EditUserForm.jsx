import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { DateFormat } from "../../utils/extra";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { ClipLoader } from "react-spinners";
import FormInput from "../FormInput";
import ComponentGuard from "../AccessControl/ComponentGuard";
import useRoles from "../../hooks/useRoles";

const EditUserForm = ({ onSubmit, onClose }) => {
  const roles = useRoles();
  const { userData, isLoading } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dateFormat: DateFormat.DD_MM_YYYY
    }
  });
  console.log(userData);

  useEffect(() => {
    if (userData) {
      reset({
        userName: userData?.userName || null,
        email: userData?.email || null,
        phone: userData?.phone || null,
        companyName: userData?.companyName || null,
        gst: userData?.gst || null, // No pre-population for GST Number
        document: null, // No pre-population for Document
        dateFormat: userData?.dateFormat || DateFormat.DD_MM_YYYY,
      });
    }
  }, [userData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Edit User Information</h2>
        <IconButton className="" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </div>
      {/* Name Field */}
      <FormInput
        name="userName"
        label="Name"
        control={control}
        validation={{
          required: "Name is required.",
          // minLength: {
          //   value: 3,
          //   message: "Name must be at least 3 characters long.",
          // },
        }}
      />

      <FormInput
        name="email"
        label="Email"
        control={control}
        validation={{
          required: "Email is required.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address.",
          },
        }}
      />

      <FormInput
        name="phone"
        label="Phone"
        control={control}
        validation={{
          required: "Phone number is required.",
          pattern: {
            value: /^\+\d{1,3}\d{9}$/,
            message: "10 Digit Phone number with Country Code is required, eg: +911234567890",
          },
        }}
      />

<Controller
                name="dateFormat"
                control={control}
                rules={{ required: "Date Format is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    select
                    label="Date Format"
                    variant="outlined"
                    error={!!errors.dateFormat}
                    helperText={errors.dateFormat?.message}
                  >
                    <MenuItem value={DateFormat.MM_DD_YYYY}>MM-DD-YYYY</MenuItem>
                    <MenuItem value={DateFormat.DD_MM_YYYY}>DD-MM-YYYY</MenuItem>
                    <MenuItem value={DateFormat.YYYY_MM_DD}>YYYY-MM-DD</MenuItem>
                  </TextField>
                )}
              />

      <ComponentGuard allowedRoles={[roles.ADMIN, roles.SUPER_ADMIN]}>
        <FormInput
          name="companyName"
          label="Company Name"
          control={control}
          validation={{
            required: "Company name is required.",
            // minLength: {
            //   value: 2,
            //   message: "Company name must be at least 2 characters long.",
            // },
          }}
        />
      </ComponentGuard>

      <ComponentGuard allowedRoles={[roles.ADMIN]}>
        {/* GST Number Field */}
        <FormInput
          name="gst"
          label="GST Number"
          control={control}
          validation={{
            required: "GST number is required.",
            pattern: {
              value: /^[0-9]{15}$/,
              message: "Please enter a valid 15-digit GST number.",
            },
          }}
        />

        {/* Document Upload Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document
          </label>
          <TextField
            type="file"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register("document")}
            error={!!errors.document}
            helperText={errors.document?.message}
          />
        </div>
      </ComponentGuard>

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {isLoading ? <ClipLoader color="#fff" size={20} /> : "Save Info"}
      </Button>
    </form>
  );
};

export default EditUserForm;
