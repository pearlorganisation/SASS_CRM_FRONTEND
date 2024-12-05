import React from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Required CSS for the date picker
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";

const FilterModal = ({ modalName, onApply }) => {
  const dispatch = useDispatch();
  const { modals, modalData } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;
  const { control, handleSubmit, register, reset } = useForm();

  const onSubmit = (data) => {
    const filterData = {
      email: data.email || undefined,
      companyName: data.companyName || undefined,
      userName: data.userName || undefined,
      phone: data.phone || undefined,
      isActive: data.isActive || undefined,
      planName: data.planName || undefined,
      planStartDate:
        data.planStartDateStart || data.planStartDateEnd
          ? {
              $gte: data.planStartDateStart || undefined,
              $lte: data.planStartDateEnd || undefined,
            }
          : undefined,
      planExpiry:
        data.planExpiryStart || data.planExpiryEnd
          ? {
              $gte: data.planExpiryStart || undefined,
              $lte: data.planExpiryEnd || undefined,
            }
          : undefined,
      contactsLimit:
        data.contactsLimitStart || data.contactsLimitEnd
          ? {
              $gte: data.contactsLimitStart || undefined,
              $lte: data.contactsLimitEnd || undefined,
            }
          : undefined,
      totalEmployees:
        data.totalEmployeesStart || data.totalEmployeesEnd
          ? {
              $gte: data.totalEmployeesStart || undefined,
              $lte: data.totalEmployeesEnd || undefined,
            }
          : undefined,
      employeeSalesCount:
        data.employeeSalesCountStart || data.employeeSalesCountEnd
          ? {
              $gte: data.employeeSalesCountStart || undefined,
              $lte: data.employeeSalesCountEnd || undefined,
            }
          : undefined,
      employeeReminderCount:
        data.employeeReminderCountStart || data.employeeReminderCountEnd
          ? {
              $gte: data.employeeReminderCountStart || undefined,
              $lte: data.employeeReminderCountEnd || undefined,
            }
          : undefined,
      contactsCount:
        data.contactsCountStart || data.contactsCountEnd
          ? {
              $gte: data.contactsCountStart || undefined,
              $lte: data.contactsCountEnd || undefined,
            }
          : undefined,
    };
    onClose();
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white p-6 rounded-md mx-auto mt-20 w-full max-w-2xl max-h-[80dvh] overflow-y-auto">
        <Typography variant="h6" className="text-center mb-4">
          Filter Data
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Text Fields */}
          <div className="grid grid-cols-2 gap-4">
            <TextField {...register("email")} label="Email" fullWidth />
            <TextField
              {...register("companyName")}
              label="Company Name"
              fullWidth
            />
            <TextField {...register("userName")} label="User Name" fullWidth />
            <TextField {...register("phone")} label="Phone" fullWidth />
            <TextField {...register("planName")} label="Plan Name" fullWidth />
          </div>

          {/* Checkbox */}
          <FormControlLabel
            control={<Checkbox {...register("isActive")} />}
            label="Is Active"
          />

          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="planStartDateStart"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  className="border p-2 rounded"
                  placeholderText="Plan Start Date (From)"
                />
              )}
            />
            <Controller
              name="planStartDateEnd"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  className="border p-2 rounded"
                  placeholderText="Plan Start Date (To)"
                />
              )}
            />
            <Controller
              name="planExpiryStart"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  className="border p-2 rounded"
                  placeholderText="Plan Expiry (From)"
                />
              )}
            />
            <Controller
              name="planExpiryEnd"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  className="border p-2 rounded"
                  placeholderText="Plan Expiry (To)"
                />
              )}
            />
          </div>

          {/* Number Ranges */}
          <div className="grid grid-cols-2 gap-4">
            <TextField
              {...register("contactsLimitStart")}
              label="Contacts Limit (Min)"
              type="number"
              fullWidth
            />
            <TextField
              {...register("contactsLimitEnd")}
              label="Contacts Limit (Max)"
              type="number"
              fullWidth
            />
            <TextField
              {...register("totalEmployeesStart")}
              label="Total Employees (Min)"
              type="number"
              fullWidth
            />
            <TextField
              {...register("totalEmployeesEnd")}
              label="Total Employees (Max)"
              type="number"
              fullWidth
            />
            <TextField
              {...register("employeeSalesCountStart")}
              label="Sales Count (Min)"
              type="number"
              fullWidth
            />
            <TextField
              {...register("employeeSalesCountEnd")}
              label="Sales Count (Max)"
              type="number"
              fullWidth
            />
            <TextField
              {...register("employeeReminderCountStart")}
              label="Reminder Count (Min)"
              type="number"
              fullWidth
            />
            <TextField
              {...register("employeeReminderCountEnd")}
              label="Reminder Count (Max)"
              type="number"
              fullWidth
            />
            <TextField
              {...register("contactsCountStart")}
              label="Contacts Count (Min)"
              type="number"
              fullWidth
            />
            <TextField
              {...register("contactsCountEnd")}
              label="Contacts Count (Max)"
              type="number"
              fullWidth
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Apply Filters
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default FilterModal;
