import React, { memo, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";



import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";
import FormInput from "../FormInput";
import { filterTruthyValues } from "../../utils/extra";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import { getCustomOptionsForFilters } from "../../features/actions/globalData";
import { webinarAttendeesSortByOptions } from "../../utils/columnData";
import { setWebinarAttendeesFilters } from "../../features/slices/filters.slice";
import tagsService from "../../services/tagsService";
import { getAllProductsByAdminId } from "../../features/actions/product";

const FilterModal = ({ modalName, setPage }) => {
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();

  const { leadTypeData } = useSelector((state) => state.assign);
  const { subscription } = useSelector((state) => state.auth);
  const { customOptionsForFilters } = useSelector((state) => state.globalData);
  const { control, handleSubmit, reset } = useForm();
  const { webinarAttendeesSortBy, webinarAttendeesFilters } = useSelector(
    (state) => state.filters
  );
  const { productDropdownData } = useSelector((state) => state.product);
  const [sortBy, setSortBy] = useState(
    webinarAttendeesSortBy || {
      sortBy: webinarAttendeesSortByOptions[0].value,
      sortOrder: "asc",
    }
  );
  const [tagData, setTagData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [leadTypeOptions, setLeadTypeOptions] = useState([]);
  const tableConfig = subscription?.plan?.attendeeTableConfig || {};

  const onSubmit = (data) => {
    if (selectedOption) data.leadType = selectedOption;
    const filterData = filterTruthyValues(data);
    setPage(1);
    dispatch(
      setWebinarAttendeesFilters({
        filters: filterData,
        sortBy: sortBy,
      })
    );
    dispatch(closeModal(modalName));
    logUserActivity({
      action: "filter",
      type: "to Table",
      detailItem: "Attendees",
    });
  };

  const resetForm = () => {
    setSelectedOption("");
    reset({
      email: "",
      firstName: "",
      lastName: "",
      "timeInSession.$gte": null,
      "timeInSession.$lte": null,
      gender: "",
      phone: "",
      location: "",
      status: "",
    });
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
  };

  useEffect(() => {
    tagsService.getTags().then((res) => {
      if (res.success) {
        setTagData(res.data);
      }
    });
    dispatch(getCustomOptionsForFilters());
    if (webinarAttendeesFilters?.leadType)
      setSelectedOption(webinarAttendeesFilters?.leadType);
    reset({
      ...webinarAttendeesFilters,
    });

    dispatch(getAllProductsByAdminId());
  }, []);

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
    <Modal open={true} onClose={onClose} disablePortal>
      <Box className="bg-white p-6 rounded-md mx-auto mt-10 w-full max-w-2xl ">
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
                        {customOptionsForFilters.map((option) => (
                          <MenuItem key={option.value} value={option.label}>
                            {option.label}
                          </MenuItem>
                        ))}
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
                    onChange={(e) => setSelectedOption(e.target.value)}
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
              {tableConfig?.tags?.filterable && (
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Tags</InputLabel>
                      <Select
                        multiple
                        {...field}
                        label="Tags"
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        renderValue={(selected) => selected.join(", ")}
                      >
                        {tagData.map((item) => (
                          <MenuItem key={item._id} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}
              {tableConfig?.enrollments?.filterable && (
                <Controller
                  name="enrollments"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Enrollments</InputLabel>
                      <Select
                        multiple
                        {...field}
                        label="Enrollments"
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}
                        renderValue={(selected) =>
                          productDropdownData
                            .filter((product) => selected.includes(product._id))
                            .map((product) => product.name)
                            .join(", ")
                        }
                      >
                        {(
                          productDropdownData?.map((product) => ({
                            value: product._id,
                            label: `${product.name} | Level - ${product.level}`,
                          })) || []
                        ).map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <p className="text-sm font-medium">Sort By</p>
            <div className="grid grid-cols-2 gap-2">
              <FormControl fullWidth>
                <Select
                  labelId="sort-by-select-label"
                  value={sortBy.sortBy || ""}
                  className="shadow font-semibold h-10"
                  onChange={(e) =>
                    setSortBy((prev) => ({
                      ...prev,
                      sortBy: e.target.value,
                    }))
                  }
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "#888" }}>Select Sort By</span> // Placeholder style
                      );
                    }
                    const selectedOption = webinarAttendeesSortByOptions.find(
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
                        <span>{selectedOption?.label}</span>
                      </div>
                    );
                  }}
                >
                  {webinarAttendeesSortByOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <Select
                  labelId="sort-order-select-label"
                  value={sortBy.sortOrder || ""}
                  className="shadow font-semibold h-10"
                  onChange={(e) =>
                    setSortBy((prev) => ({
                      ...prev,
                      sortOrder: e.target.value,
                    }))
                  }
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <span style={{ color: "#888" }}>Select Order</span> // Placeholder style
                      );
                    }
                    const selectedOption = ["asc", "desc"].find(
                      (option) => option === selected
                    );

                    return (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span className="capitalize">{selectedOption}</span>
                      </div>
                    );
                  }}
                >
                  {["asc", "desc"].map((option) => (
                    <MenuItem key={option} value={option}>
                      <ListItemText className="capitalize" primary={option} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex justify-between space-x-2">
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
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default memo(FilterModal);
