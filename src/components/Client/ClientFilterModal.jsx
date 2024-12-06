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
import { filterTruthyValues } from "../../utils/extra";

const FilterModal = ({ modalName, setFilters, filters }) => {
  const dispatch = useDispatch();
  const { modals } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;
  const { control, handleSubmit, register, reset } = useForm();

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
      isActive: false,
      toggleLimit: null,
      planStartDate: null,
      planExpiry: null,
      contactsLimit: null,
      totalEmployees: null,
      employeeSalesCount: null,
      employeeReminderCount: undefined,
    });
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
  };
  console.log("render");

  useEffect(() => {
    console.log("useEffect", filters);
    if (open) {
      reset(filters);
    }
  }, [open]);

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
                defaultValue={false} // Ensure it's always controlled
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value || false} // Prevent undefined issues
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
                name="contactsLimit.$gte"
                label="Contacts Limit (Min)"
                control={control}
                type="number"
              />
              <FormInput
                name="contactsLimit.$lte"
                label="Contacts Limit (Max)"
                control={control}
                type="number"
              />
              <FormInput
                name="totalEmployees.$gte"
                label="Total Employees (Min)"
                control={control}
                type="number"
              />
              <FormInput
                name="totalEmployees.$lte"
                label="Total Employees (Max)"
                control={control}
                type="number"
              />
              <FormInput
                name="employeeSalesCount.$gte"
                label="Sales Count (Min)"
                control={control}
                type="number"
              />
              <FormInput
                name="employeeSalesCount.$lte"
                label="Sales Count (Max)"
                control={control}
                type="number"
              />
              <FormInput
                name="employeeReminderCount.$gte"
                label="Reminder Count (Min)"
                control={control}
                type="number"
              />
              <FormInput
                name="employeeReminderCount.$lte"
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
            <Button
              variant="contained"
              color="primary"
              onClick={resetForm}
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
