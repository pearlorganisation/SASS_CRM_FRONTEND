import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Required CSS for the date picker
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";
import FormInput from "../FormInput";
import { filterTruthyValues } from "../../utils/extra";
import { getPlansForDropdown } from "../../features/actions/pricePlan";

const FilterModal = ({ modalName, setFilters, filters }) => {
  // console.log("filter modal render");
  const dispatch = useDispatch();
  const { control, handleSubmit, register, reset } = useForm();
  const { plansForDropdown } = useSelector((state) => state.pricePlans);

  const onSubmit = (data) => {
    const filterData = filterTruthyValues(data);
    setFilters(filterData);
    dispatch(closeModal(modalName));
  };

  const resetForm = () => {
    reset({
      email: "",
      companyName: "",
      userName: "",
      phone: "",
      planName: "",
      isActive: "",
      toggleLimit: null,
      planStartDate: null,
      planExpiry: null,
      contactsLimit: null,
      employeeLimit: null,
      usedContactsCount: null,
      remainingDays: null,
      totalEmployees: null,
      employeeSalesCount: null,
      employeeReminderCount: null,
    });
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
  };

  useEffect(() => {
    console.log("filters", filters);
    reset({
      ...filters,
      isActive: filters.isActive,
    });
  }, []);

  return (
    <Modal open={true} onClose={onClose} disablePortal>
      <Box className="bg-white p-6 rounded-md mx-auto mt-20 w-full max-w-2xl ">
        <Typography variant="h6" className="text-center mb-4">
          Client Filters
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="max-h-[65dvh] overflow-y-auto space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="email" label="Email" control={control} />
              <FormInput
                name="companyName"
                label="Company Name"
                control={control}
              />
              <FormInput name="userName" label="User Name" control={control} />
              <FormInput name="phone" label="Phone" control={control} />
              <Controller
                name="planName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="plan-name-label">Plan Name</InputLabel>
                    <Select
                      {...field}
                      labelId="plan-name-label"
                      label="Plan Name"
                      value={field.value || ""}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            overflow: "auto",
                          },
                        },
                      }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {plansForDropdown.map((plan) => (
                        <MenuItem key={plan.value} value={plan.value}>
                          {plan.label}
                        </MenuItem>
                      ))}

                    </Select>
                  </FormControl>
                )}
              />
              {/* Select dropdown for Active/Inactive */}
              <Controller
                name="isActive"
                control={control}
                defaultValue="" // Ensure it's always controlled
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="active-inactive-label">
                      Is Active
                    </InputLabel>
                    <Select
                      {...field}
                      labelId="active-inactive-label"
                      label="Is Active"
                      value={field.value || ""} // Ensure value is always controlled
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <FormInput
                name="remainingDays.$gte"
                label="Remaining Days (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="remainingDays.$lte"
                label="Remaining Days (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />

              <FormInput
                name="usedContactsCount.$gte"
                label="Used Contacts Count (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="usedContactsCount.$lte"
                label="Used Contacts Count (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />

              <FormInput
                name="contactsLimit.$gte"
                label="Contacts Limit (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="contactsLimit.$lte"
                label="Contacts Limit (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="employeeLimit.$gte"
                label="Employee Limit (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="employeeLimit.$lte"
                label="Employee Limit (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />

              <FormInput
                name="totalEmployees.$gte"
                label="Total Employees (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="totalEmployees.$lte"
                label="Total Employees (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="employeeSalesCount.$gte"
                label="Sales Count (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="employeeSalesCount.$lte"
                label="Sales Count (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="employeeReminderCount.$gte"
                label="Reminder Count (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="employeeReminderCount.$lte"
                label="Reminder Count (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />

              <FormInput
                name="toggleLimit.$gte"
                label="Toggle Limit (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
              <FormInput
                name="toggleLimit.$lte"
                label="Toggle Limit (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 0,
                    message: "Value must be at least 0",
                  },
                }}
              />
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1">
                <Controller
                  name="planStartDate.$gte"
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
                  name="planStartDate.$lte"
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
                  name="planExpiry.$gte"
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
                  name="planExpiry.$lte"
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
            <Button variant="contained" color="primary" onClick={resetForm}>
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
