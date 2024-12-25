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
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";
import FormInput from "../FormInput";
import { filterTruthyValues } from "../../utils/extra";
import useAddUserActivity from "../../hooks/useAddUserActivity";

const FilterModal = ({ modalName, setFilters, filters }) => {
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();

  const { modals } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;
  const { control, handleSubmit, reset } = useForm();

  const [selectedOption, setSelectedOption] = useState("");
  const [leadTypeOptions, setLeadTypeOptions] = useState([]);
  const { leadTypeData } = useSelector((state) => state.assign);
  const { subscription } = useSelector((state) => state.auth);
  const tableConfig = subscription?.plan?.attendeeTableConfig || {};
  //console.log(subscription?.plan);

  const onSubmit = (data) => {
    const filterData = filterTruthyValues(data);
    setFilters(filterData);
    dispatch(closeModal(modalName));
    logUserActivity({
      action: "filter",
      type: "to Table",
      detailItem: "Attendees",
    });
  };

  const resetForm = () => {
    reset({
      email: "",
      firstName: "",
      lastName: "",
      "timeInSession.$gte": null,
      "timeInSession.$lte": null,
      gender: "",
      phone: "",
      location: "",
    });
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
  };

  useEffect(() => {
    if (open) {
      reset({
        ...filters,
      });
    }
  }, [open]);

  useEffect(() => {
    if (!leadTypeData) return;
    const options = leadTypeData.map((item) => ({
      value: item._id,
      label: item.label,
      color: item.color,
    }));
    setLeadTypeOptions(options);
  }, [leadTypeData]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white p-6 rounded-md mx-auto mt-20 w-full max-w-2xl ">
        <Typography variant="h6" className="text-center mb-4">
          Attendees Filter
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="max-h-[65dvh] overflow-y-auto space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              {tableConfig?.email?.filterable && (
                <FormInput name="email" label="Email" control={control} />
              )}

              {tableConfig?.firstName?.filterable && (
                <FormInput
                  name="firstName"
                  label="First Name"
                  control={control}
                />
              )}

              {tableConfig?.lastName?.filterable && (
                <FormInput
                  name="lastName"
                  label="Last Name"
                  control={control}
                />
              )}

              {tableConfig?.gender?.filterable && (
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select
                        {...field}
                        labelId="gender-label"
                        label="Gender"
                        value={field.value || ""}
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              )}

              {tableConfig?.isAssigned?.filterable &&
                modalName !== "ViewAssignmentsFilterModal" && (
                  <Controller
                    name="isAssigned"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="isAssigned-label">
                          Is Assigned
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="isAssigned-label"
                          label="Is Assigned"
                          value={field.value || ""}
                        >
                          <MenuItem value="">All</MenuItem>
                          <MenuItem value="true">Assigned</MenuItem>
                          <MenuItem value="false">Not Assigned</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                )}

              {tableConfig?.timeInSession?.filterable && (
                <>
                  <FormInput
                    name="timeInSession.$gte"
                    label="Time in Session (Min)"
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
                    name="timeInSession.$lte"
                    label="Time in Session (Max)"
                    control={control}
                    type="number"
                    validation={{
                      min: {
                        value: 0,
                        message: "Value must be at least 0",
                      },
                    }}
                  />
                </>
              )}

              {tableConfig?.phone?.filterable && (
                <FormInput
                  name="phone"
                  label="Phone"
                  control={control}
                  // validation={{
                  //   pattern: {
                  //     value: /^[0-9]$/,
                  //     message: "Phone number must be 10 digits",
                  //   },
                  // }}
                />
              )}
              {tableConfig?.location?.filterable && (
                <FormInput name="location" label="Location" control={control} />
              )}
              {tableConfig?.status?.filterable && (
                <Controller
                  name="status"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel id="status-label">Status</InputLabel>
                      <Select
                        {...field}
                        labelId="status-label"
                        label="Status"
                        value={field.value || ""}
                      >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="male">will join webinar</MenuItem>
                        <MenuItem value="female"> no answer</MenuItem>
                        <MenuItem value="other">no network</MenuItem>
                        <MenuItem value="other">asked to call later</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              )}
              {tableConfig?.leadType?.filterable && (
                <FormControl fullWidth>
                  <Select
                    labelId="lead-type-select-label"
                    value={selectedOption || ""}
                    className="shadow font-semibold"
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return (
                          <span style={{ color: "#888" }}>
                            Select Lead Type
                          </span> // Placeholder style
                        );
                      }
                      const selectedOption = leadTypeOptions.find(
                        (option) => option.value === selected
                      );
                      return (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: selectedOption?.color || "#000",
                            }}
                          />
                          <span>{selectedOption?.label}</span>
                        </div>
                      );
                    }}
                  >
                    {leadTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <ListItemIcon>
                          <div
                            style={{
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              backgroundColor: option.color,
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={option.label} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
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
