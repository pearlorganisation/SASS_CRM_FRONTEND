import React, { useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Required CSS for the date picker
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";
import FormInput from "../FormInput";

const FilterModal = ({ modalName, setFilters, filters }) => {
  const dispatch = useDispatch();
  const { modals } = useSelector((state) => state.modals);
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
      toggleLimit: data.toggleLimit || undefined,
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
              $gte: Number(data.contactsLimitStart) || undefined,
              $lte: Number(data.contactsLimitEnd) || undefined,
            }
          : undefined,
      totalEmployees:
        data.totalEmployeesStart || data.totalEmployeesEnd
          ? {
              $gte: Number(data.totalEmployeesStart) || undefined,
              $lte: Number(data.totalEmployeesEnd) || undefined,
            }
          : undefined,
      employeeSalesCount:
        data.employeeSalesCountStart || data.employeeSalesCountEnd
          ? {
              $gte: Number(data.employeeSalesCountStart) || undefined,
              $lte: Number(data.employeeSalesCountEnd) || undefined,
            }
          : undefined,
      employeeReminderCount:
        data.employeeReminderCountStart || data.employeeReminderCountEnd
          ? {
              $gte: Number(data.employeeReminderCountStart) || undefined,
              $lte: Number(data.employeeReminderCountEnd) || undefined,
            }
          : undefined,
      // contactsCount:
      //   data.contactsCountStart || data.contactsCountEnd
      //     ? {
      //         $gte: data.contactsCountStart || undefined,
      //         $lte: data.contactsCountEnd || undefined,
      //       }
      //     : undefined,
    };
    setFilters(filterData);
    dispatch(closeModal(modalName));
    console.log("filterData", filterData);
  };

  const resetForm = () => {
    reset({
      email: "",
      companyName: "",
      userName: "",
      phone: "",
      planName: "",
      isActive: false,
      planStartDateStart: null,
      planStartDateEnd: null,
      planExpiryStart: null,
      planExpiryEnd: null,
      contactsLimitStart: "",
      contactsLimitEnd: "",
      totalEmployeesStart: "",
      totalEmployeesEnd: "",
      employeeSalesCountStart: "",
      employeeSalesCountEnd: "",
      employeeReminderCountStart: "",
      employeeReminderCountEnd: "",
      contactsCountStart: "",
      contactsCountEnd: "",
    });
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
  };
  console.log("render");

  useEffect(() => {
    console.log("useEffect", filters);
    if (open) {
      const resetData = {
        ...filters,
        planStartDateStart: filters?.planStartDate?.$gte
          ? filters.planStartDate?.$gte
          : null,
        planStartDateEnd: filters.planStartDate?.$lte
          ? filters.planStartDate?.$lte
          : null,
        planExpiryStart: filters.planExpiry?.$gte
          ? filters.planExpiry?.$gte
          : null,
        planExpiryEnd: filters.planExpiry?.$lte
          ? filters.planExpiry?.$lte
          : null,
        contactsLimitStart: filters.contactsLimit?.$gte
          ? filters.contactsLimit?.$gte
          : null,
        contactsLimitEnd: filters.contactsLimit?.$lte
          ? filters.contactsLimit?.$lte
          : null,
        totalEmployeesStart: filters.totalEmployees?.$gte
          ? filters.totalEmployees?.$gte
          : null,
        totalEmployeesEnd: filters.totalEmployees?.$lte
          ? filters.totalEmployees?.$lte
          : null,
        employeeSalesCountStart: filters.employeeSalesCount?.$gte
          ? filters.employeeSalesCount?.$gte
          : null,
        employeeSalesCountEnd: filters.employeeSalesCount?.$lte
          ? filters.employeeSalesCount?.$lte
          : null,
        employeeReminderCountStart: filters.employeeReminderCount?.$gte
          ? filters.employeeReminderCount?.$gte
          : null,
        employeeReminderCountEnd: filters.employeeReminderCount?.$lte
          ? filters.employeeReminderCount?.$lte
          : null,
        isActive: filters.isActive || false,
        toggleLimit: filters.toggleLimit || 0,
      };
      reset(resetData);
    }
  }, [open, reset]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white p-6 rounded-md mx-auto mt-20 w-full max-w-2xl ">
        <Typography variant="h6" className="text-center mb-4">
          Client Filters
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="max-h-[65dvh] overflow-y-auto space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="email"
                label="Email"
                control={control}
                defaultValue=""
              />
              <FormInput
                name="companyName"
                label="Company Name"
                control={control}
                register={register}
              />
              <FormInput
                name="userName"
                label="User Name"
                control={control}
                register={register}
              />
              <FormInput
                name="phone"
                label="Phone"
                control={control}
                register={register}
              />
              <FormInput
                name="planName"
                label="Plan Name"
                control={control}
                register={register}
              />
              {/* Checkbox */}
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value} // Use the field value for checked state
                      />
                    }
                    label="Is Active"
                  />
                )}
              />
            </div>

            {/* Number Ranges */}
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="contactsLimitStart"
                label="Contacts Limit (Min)"
                control={control}
                type="number"
              />
              <FormInput
                name="contactsLimitEnd"
                label="Contacts Limit (Max)"
                control={control}
                type="number"
              />
              <FormInput
                name="totalEmployeesStart"
                label="Total Employees (Min)"
                control={control}
                type="number"
              />
              <FormInput
                name="totalEmployeesEnd"
                label="Total Employees (Max)"
                control={control}
                type="number"
              />
              <FormInput
                name="employeeSalesCountStart"
                label="Sales Count (Min)"
                control={control}
                type="number"
              />
              <FormInput
                name="employeeSalesCountEnd"
                label="Sales Count (Max)"
                control={control}
                type="number"
              />
              <FormInput
                name="employeeReminderCountStart"
                label="Reminder Count (Min)"
                control={control}
                type="number"
              />
              <FormInput
                name="employeeReminderCountEnd"
                label="Reminder Count (Max)"
                control={control}
                type="number"
              />

              <FormInput
                name="toggleLimit.$gte"
                label="Toggle Limit (Min)"
                control={control}
                type="number"
              />
              <FormInput
                name="toggleLimit.$lte"
                label="Toggle Limit (Max)"
                control={control}
                type="number"
              />
              {/* <FormInput
                name="contactsCountStart"
                label="Contacts Count (Min)"
                control={control}
                type="number"
              />
              <FormInput
                name="contactsCountEnd"
                label="Contacts Count (Max)"
                control={control}
                type="number"
              /> */}
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1">
                <Controller
                  name="planStartDateStart"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className="border p-4 w-full rounded flex-1"
                      placeholderText="Plan Start Date (From)"
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-1">
                <Controller
                  name="planStartDateEnd"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className="border p-4 w-full rounded"
                      placeholderText="Plan Start Date (To)"
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1">
                <Controller
                  name="planExpiryStart"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className="border p-4 w-full rounded"
                      placeholderText="Plan Expiry (From)"
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1">
                <Controller
                  name="planExpiryEnd"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className="border p-4 w-full rounded"
                      placeholderText="Plan Expiry (To)"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                console.log("resetting form");
                resetForm();
              }}
            >
              Reset
            </Button>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Apply Filters
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default FilterModal;
