import React, { useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";
import FormInput from "../FormInput";
import { filterTruthyValues } from "../../utils/extra";
import useRoles from "../../hooks/useRoles";
import useAddUserActivity from "../../hooks/useAddUserActivity";

const FilterModal = ({ modalName, setFilters, filters }) => {
  const roles = useRoles();
  const dispatch = useDispatch();
    const logUserActivity = useAddUserActivity();

  const { modals } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    const filterData = filterTruthyValues(data);
    setFilters(filterData);
    logUserActivity({
        action: "filter",
        type: "to Table",
        detailItem: 'Employees',
      })
    dispatch(closeModal(modalName));
  };

  const resetForm = () => {
    reset({
      email: "",
      userName: "",
      phone: "",
      isActive: "",
      role: "",
      validCallTime: null,
      dailyContactLimit: null,
    });
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
  };

  useEffect(() => {
    if (open) {
      reset({
        ...filters,
        isActive: filters.isActive,
        role: filters.role,
      });
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} disablePortal>
      <Box className="bg-white p-6 rounded-md mx-auto mt-20 w-full max-w-2xl ">
        <Typography variant="h6" className="text-center mb-4">
          Employee Filters
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="max-h-[65dvh] overflow-y-auto space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <FormInput name="email" label="Email" control={control} />
              <FormInput name="userName" label="User Name" control={control} />
              <FormInput name="phone" label="Phone" control={control} />
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              <Controller
                name="role"
                control={control}
                defaultValue="" // Ensure it's always controlled
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="active-inactive-label">Role</InputLabel>
                    <Select
                      {...field}
                      labelId="active-inactive-label"
                      label="Role"
                      value={field.value || ""} // Ensure value is always controlled
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value={roles.EMPLOYEE_REMINDER}>
                        EMPLOYEE REMINDER
                      </MenuItem>
                      <MenuItem value={roles.EMPLOYEE_SALES}>
                        EMPLOYEE SALES
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <FormInput
                name="validCallTime.$gte"
                label="Valid Call Time (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                }}
              />
              <FormInput
                name="validCallTime.$lte"
                label="Valid Call Time (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                }}
              />
              <FormInput
                name="dailyContactLimit.$gte"
                label="Daily Contact Limit (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                }}
              />
              <FormInput
                name="dailyContactLimit.$lte"
                label="Daily Contact Limit (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                }}
              />
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
