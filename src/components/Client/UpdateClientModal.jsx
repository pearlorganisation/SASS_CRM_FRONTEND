import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const UpdateClientModal = ({ open, onClose, defaultUserInfo, onUpdate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultUserInfo,
  });
  console.log("it skdflskdjf",defaultUserInfo)

  useEffect(() => {
    console.log("reseting")
    reset(defaultUserInfo);
  },[defaultUserInfo])

  const onSubmit = (data) => {
    onUpdate(data); // Pass updated data to the parent handler
    onClose(); // Close modal after submission
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Client Information</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          color="primary"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateClientModal;
