import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import { updateClient } from "../../features/actions/client";
import { useDispatch, useSelector } from "react-redux";
import { resetClientState } from "../../features/slices/client";
import { ClipLoader } from "react-spinners";

const UpdateClientModal = ({ open, onClose, defaultUserInfo }) => {
  const dispatch = useDispatch();
  const { isUpdating, isSuccess } = useSelector((state) => state.client);
  const [activeTab, setActiveTab] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset({
      userName: defaultUserInfo?.userName,
      email: defaultUserInfo?.email,
      phone: defaultUserInfo?.phone,
      companyName: defaultUserInfo?.companyName,
      _id: defaultUserInfo?._id,
    });
  }, [defaultUserInfo]);

  const onSubmit = (data) => {
    const payload = {};
    if (activeTab === 0) {
      payload.userName = data.userName;
      payload.email = data.email;
      payload.phone = data.phone;
      payload.companyName = data.companyName;
    } else {
      payload.password = data.newPassword;
    }

    dispatch(updateClient({ data: payload, id: data?._id }));
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      reset();
    }
    return () => {
      dispatch(resetClientState());
    };
  }, [isSuccess]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClose = () => {
    onClose();
    setActiveTab(0);
  };

  const validatePassword = (value) => {
    const newPassword = watch("newPassword");
    if (newPassword !== value) {
      return "Passwords do not match.";
    }
    return true;
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Client Information</DialogTitle>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label="Basic Info" />
        <Tab label="Password" />
      </Tabs>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* Tab Content */}
          {activeTab === 0 && (
            <Box className="space-y-4">
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
                    message:
                      "Please enter a valid phone number (10-15 digits).",
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
            </Box>
          )}
          {activeTab === 1 && (
            <Box className="space-y-4">
              {/* New Password Field */}
              <TextField
                {...register("newPassword", {
                  required: "New password is required.",
                  // minLength: {
                  //   value: 8,
                  //   message: "Password must be at least 8 characters long.",
                  // },
                })}
                label="New Password"
                type="password"
                fullWidth
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
              />
              {/* Confirm Password Field */}
              <TextField
                {...register("confirmPassword", {
                  required: "Confirm password is required.",
                  validate: validatePassword,
                })}
                label="Confirm Password"
                type="password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Box>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isUpdating}
          color="primary"
        >
          {isUpdating ? (
            <ClipLoader color="#fff" className="mx-5" size={20} />
          ) : (
            "Update"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateClientModal;
