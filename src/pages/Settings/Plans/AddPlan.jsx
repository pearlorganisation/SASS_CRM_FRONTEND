import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addPricePlans,
  getPricePlan,
  updatePricePlans,
} from "../../../features/actions/pricePlan";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Collapse,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import FormInput from "../../../components/FormInput";
import { filterTruthyValues } from "../../../utils/extra";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { getCustomOptions } from "../../../features/actions/globalData";
import { attendeeTableColumns } from "../../../utils/columnData";
import { getAllClientsForDropdown } from "../../../features/actions/client";
import { toast } from "sonner";
import DiscountSection from "./DiscountSection";
const tableCellStyles = {
  paddingTop: "6px",
  paddingBottom: "6px",
};
function AttendeeTable({ control, setValue, watch }) {
  const { customOptions } = useSelector((state) => state.globalData);
  return (
    <Box mt={6}>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Field Name</TableCell>
              <TableCell align="center">Filterable</TableCell>
              <TableCell align="center">Downloadable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { header: "Lead Type", key: "leadType", width: 20, type: "" },
              ...attendeeTableColumns,
              { header: "Webinar Attended", key: "attendedWebinarCount", width: 20, type: "" },
            ].map(({ key, header }) => (
              <TableRow key={key}>
                <TableCell sx={tableCellStyles}>{header}</TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  <Controller
                    name={`attendeeTableConfig.${key}.filterable`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          // Update "Downloadable" checkbox
                          onChange(isChecked);
                          // Automatically check "Filterable" if "Downloadable" is checked
                          if (!isChecked) {
                            setValue(
                              `attendeeTableConfig.${key}.downloadable`,
                              false
                            );

                            if (key === "status") {
                              customOptions.forEach((option) =>
                                setValue(
                                  `attendeeTableConfig.defaultOptions.${option?.label}`,
                                  false
                                )
                              );
                              setValue(
                                `attendeeTableConfig.customOptions.filterable`,
                                false
                              );
                            }
                          }
                        }}
                        checked={value || false}
                      />
                    )}
                  />
                </TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  <Controller
                    name={`attendeeTableConfig.${key}.downloadable`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          // Update "Downloadable" checkbox
                          onChange(isChecked);
                          // Automatically check "Filterable" if "Downloadable" is checked
                          if (isChecked) {
                            setValue(
                              `attendeeTableConfig.${key}.filterable`,
                              true
                            );
                          }
                        }}
                        checked={value || false}
                      />
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell></TableCell>
              <TableCell
                sx={{
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  fontWeight: "bold",
                }}
              >
                Default Options
              </TableCell>

              <TableCell sx={tableCellStyles}></TableCell>
            </TableRow>

            {customOptions.map((option) => (
              <TableRow key={option?._id}>
                <TableCell />
                <TableCell>{option?.label}</TableCell>
                <TableCell align="center" sx={tableCellStyles}>
                  <Controller
                    name={`attendeeTableConfig.defaultOptions.${option?.label}`}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          // Update "Downloadable" checkbox
                          onChange(isChecked);
                        }}
                        checked={value || false}
                        disabled={
                          !watch(`attendeeTableConfig.status.filterable`)
                        }
                      />
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell sx={tableCellStyles}>Custom Options</TableCell>
              <TableCell align="center" sx={tableCellStyles}>
                <Controller
                  name={`attendeeTableConfig.customOptions.filterable`}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Checkbox
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        // Update "Downloadable" checkbox
                        onChange(isChecked);
                      }}
                      checked={value || false}
                      disabled={
                        !watch(`attendeeTableConfig.status.filterable`) ||
                        !watch(`attendeeTableConfig.isCustomOptionsAllowed`)
                      }
                    />
                  )}
                />
                {console.log(
                  !watch(`attendeeTableConfig.status.filterable`) &&
                    !watch(`attendeeTableConfig.isCustomOptionsAllowed`)
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default function AddPlan() {
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(id ? true : false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const { isLoading, planData, isSuccess, singlePlanData } = useSelector(
    (state) => state.pricePlans
  );
  const { clientsDropdownData } = useSelector((state) => state.client);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [planType, setPlanType] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [planDurationConfig, setPlanDurationConfig] = useState({
    monthly: {
      duration: 30,
      discountType: "percent",
      discountValue: 0,
    },
    quarterly: {
      duration: 90,
      discountType: "percent",
      discountValue: 0,
    },
    halfyearly: {
      duration: 180,
      discountType: "percent",
      discountValue: 0,
    },
    yearly: {
      duration: 365,
      discountType: "percent",
      discountValue: 0,
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
    const payload = filterTruthyValues(data);

    if (planType === "custom") {
      payload["planType"] = "custom";
      payload["assignedUsers"] = assignedUsers;
    } else {
      payload["planType"] = "normal";
    }

    if (!("attendeeTableConfig" in payload)) {
      payload["attendeeTableConfig"] = {};
    }
    if (isEditMode) {
      payload["_id"] = id;
    }

    payload['planDurationConfig'] = planDurationConfig;
    console.log(payload);
    dispatch(isEditMode ? updatePricePlans(payload) : addPricePlans(payload));
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/plans");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(getPricePlan(id));
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (isEditMode && singlePlanData) {
      reset({
        name: singlePlanData.name || "",
        amount: singlePlanData.amount || 0,
        planDuration: singlePlanData.planDuration || 0,
        employeeCount: singlePlanData.employeeCount || 0,
        contactLimit: singlePlanData.contactLimit || 0,
        toggleLimit: singlePlanData.toggleLimit || 0,
        attendeeTableConfig: singlePlanData.attendeeTableConfig || {},
      });

      setPlanType(singlePlanData.planType || "normal");
      setAssignedUsers(singlePlanData.assignedUsers || []);

      if (singlePlanData.planDurationConfig) {
        setPlanDurationConfig(singlePlanData.planDurationConfig);
      }
    }
  }, [singlePlanData, isEditMode]);

  useEffect(() => {
    if (!id) {
      setPlanType("normal");
    }

    dispatch(getAllClientsForDropdown());
    dispatch(getCustomOptions());
  }, []);

  return (
    <div className="min-h-screen pt-14 flex justify-center items-center bg-gray-100 px-2">
      <Box className="max-w-4xl w-full bg-white shadow-md rounded-lg">
        <Box className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <Typography variant="h6" className="font-semibold text-gray-800">
            {isEditMode ? "Edit Price Plan" : "Add Price Plan"}
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 w-full">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormInput
              name="name"
              label="Display Plan Name"
              control={control}
              required={true}
              errorMessage="Plan name is required"
            />
            <FormInput
              name="internalName"
              label="Unique Plan Name"
              control={control}
              required={true}
              errorMessage="Plan name is required"
            />
            <FormInput
              name="amount"
              label="Price"
              type="number"
              control={control}
              required={true}
              errorMessage="Price is required"
            />
            <FormInput
              name="employeeCount"
              label="Employees Count"
              type="number"
              control={control}
              required={true}
              errorMessage="Employee count is required"
            />
            <FormInput
              name="contactLimit"
              label="Contact Limit"
              type="number"
              control={control}
              required={true}
              errorMessage="Contact limit is required"
            />

            <FormInput
              name="toggleLimit"
              label="Toggle Limit"
              type="number"
              control={control}
              required={true}
              errorMessage="Toggle limit is required"
            />
            <FormControl variant="outlined">
              <InputLabel id="attendee-label">Plan Type</InputLabel>
              <Select
                labelId="attendee-label"
                value={planType}
                onChange={(e) => setPlanType(e.target.value)}
                label="Plan Type"
              >
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </div>

          {planType === "custom" && (
            <div className="mt-5">
              <FormControl variant="outlined" className="w-full">
                <InputLabel id="attendee-label">Users</InputLabel>
                <Select
                  labelId="attendee-label"
                  fullWidth
                  multiple
                  value={assignedUsers}
                  onChange={(e) => setAssignedUsers(e.target.value)}
                  label="Select Users"
                >
                  {clientsDropdownData.map((client, index) => (
                    <MenuItem key={index} value={client.value}>
                      {client.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

          <div className="flex mt-4 items-center">
            <Typography className="font-semibold text-gray-800">
              {"Custom Options (Create/Dropdown)"}
            </Typography>
            <Controller
              name={`attendeeTableConfig.isCustomOptionsAllowed`}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    // Update "Downloadable" checkbox
                    onChange(isChecked);
                    // Automatically check "Filterable" if "Downloadable" is checked
                    if (!isChecked) {
                      setValue(
                        `attendeeTableConfig.customOptions.filterable`,
                        false
                      );
                      // if (key === "status") {
                      //   customOptions.forEach((option) =>
                      //     setValue(
                      //       `attendeeTableConfig.defaultOptions.${option?.label}`,
                      //       false
                      //     )
                      //   );
                      //   setValue(
                      //     `attendeeTableConfig.customOptions.filterable`,
                      //     false
                      //   );
                      // }
                    }
                  }}
                  checked={value || false}
                />
              )}
            />
          </div>

          <Box className="mt-6 shadow-md">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className="cursor-pointer"
              onClick={() => setIsTableOpen(!isTableOpen)}
            >
              <Typography variant="h6" className="mb-2 font-semibold">
                Attendees
              </Typography>
              <IconButton>
                {isTableOpen ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            <Collapse in={isTableOpen} timeout="auto" unmountOnExit>
              <AttendeeTable
                watch={watch}
                control={control}
                setValue={setValue}
              />
            </Collapse>
          </Box>

          <Box className="mt-6">
            <Typography variant="h6" className="mb-2 font-semibold">
              Discounts
            </Typography>

            <DiscountSection
              planDurationConfig={planDurationConfig}
              setPlanDurationConfig={setPlanDurationConfig}
              watch={watch}
            />
          </Box>

          <Box className="mt-6">
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoading}
              className="py-2 text-sm font-medium"
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isEditMode ? (
                "Update Plan"
              ) : (
                "Add Plan"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  );
}
