import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { ClipLoader } from "react-spinners";
import FormInput from "../FormInput";

const EditUserForm = ({ onSubmit, onClose }) => {
  const { userData, isLoading } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    control,
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
      <FormInput
        name="userName"
        label="Name"
        control={control}
        validation={{
          required: "Name is required.",
          minLength: {
            value: 3,
            message: "Name must be at least 3 characters long.",
          },
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
            value: /^[0-9]{10,15}$/,
            message: "Please enter a valid phone number (10-15 digits).",
          },
        }}
      />

      <FormInput
        name="companyName"
        label="Company Name"
        control={control}
        validation={{
          required: "Company name is required.",
          minLength: {
            value: 2,
            message: "Company name must be at least 2 characters long.",
          },
        }}
      />

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        {isLoading ? <ClipLoader color="#fff" size={20} /> : "Save Info"}
      </Button>
    </form>
  );
};

export default EditUserForm;
