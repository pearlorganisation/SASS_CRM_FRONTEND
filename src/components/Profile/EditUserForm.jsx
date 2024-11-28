import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button } from "@mui/material";

const EditUserForm = ({ onSubmit, defaultUserInfo }) => {
    
      const { register, handleSubmit, reset, formState: { errors }, } = useForm({
        defaultValues: defaultUserInfo,
      });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Edit User Information</h2>

      {/* Name Field */}
      <TextField
        {...register("userName", {
          required: "Name is required.",
          minLength: {
            value: 3,
            message: "Name must be at least 3 characters long.",
          },
        })}
        label="Name"
        fullWidth
        error={!!errors.userName}
        helperText={errors.userName?.message}
      />

      {/* Email Field */}
      <TextField
        {...register("email", {
          required: "Email is required.",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address.",
          },
        })}
        label="Email"
        fullWidth
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      {/* Phone Field */}
      <TextField
        {...register("phone", {
          required: "Phone number is required.",
          pattern: {
            value: /^[0-9]{10,15}$/,
            message: "Please enter a valid phone number (10-15 digits).",
          },
        })}
        label="Phone"
        fullWidth
        error={!!errors.phone}
        helperText={errors.phone?.message}
      />

      {/* Company Name Field */}
      <TextField
        {...register("companyName", {
          required: "Company name is required.",
          minLength: {
            value: 2,
            message: "Company name must be at least 2 characters long.",
          },
        })}
        label="Company Name"
        fullWidth
        error={!!errors.companyName}
        helperText={errors.companyName?.message}
      />

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Save Info
      </Button>
    </form>
  );
};

export default EditUserForm;
