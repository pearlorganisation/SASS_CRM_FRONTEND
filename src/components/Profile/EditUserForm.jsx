import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { ClipLoader } from "react-spinners";

const EditUserForm = ({ onSubmit, onClose }) => {
  const { userData, isLoading } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userData) {
      reset({
        userName: userData?.userName || null,
        email: userData?.email || null,
        phone: userData?.phone || null,
        companyName: userData?.companyName || null,
      });
    }
  }, [userData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className=" flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Edit User Information</h2>
        <IconButton className="" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </div>
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
        {isLoading ? <ClipLoader color="#fff" size={20} /> : "Save Info"}
      </Button>
    </form>
  );
};

export default EditUserForm;
