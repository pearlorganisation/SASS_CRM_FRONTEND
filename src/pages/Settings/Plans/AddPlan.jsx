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
  Button,
  CircularProgress,
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
  TextField,
} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

import FormInput from "../../../components/FormInput";
import { filterTruthyValues } from "../../../utils/extra";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { getCustomOptions } from "../../../features/actions/globalData";
import {
  attendeeTableColumns,
  groupedAttendeeTableColumns,
} from "../../../utils/columnData";
import { getAllClientsForDropdown } from "../../../features/actions/client";
import { toast } from "sonner";
import DiscountSection from "./DiscountSection";
import { clearSinglePlanData } from "../../../features/slices/pricePlan";
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
              ...groupedAttendeeTableColumns.filter(
                (column) =>
                  !attendeeTableColumns.some(
                    (attendeeColumn) => attendeeColumn.key === column.key
                  ) && column.header !== "Email"
              ),
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
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

const regularDurations = {
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
};

export default function AddPlan() {
  const { id } = useParams();
  const [isEditMode, setIsEditMode] = useState(id ? true : false);
  const {
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
  } = useForm();
  const { isLoading, isSuccess, singlePlanData } = useSelector(
    (state) => state.pricePlans
  );
  const { clientsDropdownData } = useSelector((state) => state.client);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [planType, setPlanType] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [planDurationConfig, setPlanDurationConfig] = useState(regularDurations);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const payload = filterTruthyValues(data);

    payload["calendarFeatures"] = data["calendarFeatures"];
    payload["employeeRealTimeStatusUpdate"] =
      data["employeeRealTimeStatusUpdate"];
    payload["employeeInactivity"] = data["employeeInactivity"];
    payload["whatsappNotificationOnAlarms"] =
      data["whatsappNotificationOnAlarms"];
    payload["setAlarm"] = data["setAlarm"];
    payload["productRevenueMetrics"] = data["productRevenueMetrics"];
    payload["assignmentMetrics"] = data["assignmentMetrics"];

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

    if(planType === "normal" && payload["renewalNotAllowed"]) {
      payload["renewalNotAllowed"] = false;
    }

    payload["planDurationConfig"] = planDurationConfig;
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
        internalName: singlePlanData.internalName || "",
        amount: singlePlanData.amount || 0,
        planDuration: singlePlanData.planDuration || 0,
        employeeCount: singlePlanData.employeeCount || 0,
        contactLimit: singlePlanData.contactLimit || 0,
        toggleLimit: singlePlanData.toggleLimit || 0,
        attendeeTableConfig: singlePlanData.attendeeTableConfig || {},
        whatsappNotificationOnAlarms:
          singlePlanData.whatsappNotificationOnAlarms || false,
        employeeInactivity: singlePlanData.employeeInactivity || false,
        employeeRealTimeStatusUpdate:
          singlePlanData.employeeRealTimeStatusUpdate || false,
        calendarFeatures: singlePlanData.calendarFeatures || false,
        setAlarm: singlePlanData.setAlarm || false,
        productRevenueMetrics: singlePlanData.productRevenueMetrics || false,
        renewalNotAllowed: singlePlanData.renewalNotAllowed || false,
        customRibbon: singlePlanData.customRibbon || "",
        customRibbonColor: singlePlanData.customRibbonColor || "",
        assignmentMetrics: singlePlanData.assignmentMetrics || false,
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

    return () => {
      dispatch(clearSinglePlanData());
    }
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
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 350,
                      },
                    },
                  }}
                  inputProps={{
                    'aria-label': 'Search users',
                  }}
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

          <div className="grid grid-cols-1 mt-5 lg:grid-cols-2 gap-5">
          <FormInput
              name="customRibbon"
              label="Custom Ribbon"
              control={control}
              placeholder="Enter Custom Ribbon Label"
            />

              {/* Color Picker */}
              <Controller
                name="customRibbonColor"
                control={control}
                render={({ field }) => (
                  <div className="flex border px-4 py-[10px] rounded border-neutral-400 gap-5 items-center">
                    <label
                      htmlFor="color-picker"
                      className="block text-gray-600"
                    >
                        Custom Ribbon Color
                    </label>
                    <input
                      type="color"
                      id="color-picker"
                      {...field}
                      className="w-20 h-8 cursor-pointer border rounded-full"
                    />
                  </div>
                )}
              />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
            <div className="flex justify-between mt-4 items-center">
              <Typography 
                title="Allow creation and use of custom status options for attendee filtering"
                className="font-semibold text-gray-800">
                <span className="flex items-center">
                  Custom Options
                  <InfoIcon className="ms-2 text-blue-600 text-sm" />
                </span>
              </Typography>
              
              <Controller
                name={`attendeeTableConfig.isCustomOptionsAllowed`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      onChange(isChecked);
                      if (!isChecked) {
                        setValue(
                          `attendeeTableConfig.customOptions.filterable`,
                          false
                        );
                      }
                    }}
                    checked={value || false}
                  />
                )}
              />
            </div>

            <div className="flex justify-between mt-4 items-center">
              <Typography 
                title="Enable employee inactivity monitoring with automatic reminder notifications"
                className="font-semibold text-gray-800">
                <span className="flex items-center">
                  Employee Inactivity Tracking
                  <InfoIcon className="ms-2 text-blue-600 text-sm" />
                </span>
              </Typography>
              <Controller
                name="employeeInactivity"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    onChange={(e) => onChange(e.target.checked)}
                    checked={value || false}
                  />
                )}
              />
            </div>

            <div className="flex justify-between mt-4 items-center">
              <Typography 
                title="Enable setting alarms for important events or deadlines"
                className="font-semibold text-gray-800">
                <span className="flex items-center">
                  Set Alarm
                  <InfoIcon className="ms-2 text-blue-600 text-sm" />
                </span>
              </Typography>
              <Controller
                name="setAlarm"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      onChange(isChecked);
                      if (!isChecked) {
                        setValue('whatsappNotificationOnAlarms', false);
                      }
                    }}
                    checked={value || false}
                  />
                )}
              />
            </div>

            <div className="flex justify-between mt-4 items-center">
              <Typography 
                title="Automatically send WhatsApp messages when alarms are triggered"
                className="font-semibold text-gray-800">
                <span className="flex items-center">
                  WhatsApp Notifications
                  <InfoIcon className="ms-2 text-blue-600 text-sm" />
                </span>
              </Typography>
              <Controller
                name="whatsappNotificationOnAlarms"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    onChange={(e) => onChange(e.target.checked)}
                    checked={value || false}
                    disabled={!watch('setAlarm')}
                  />
                )}
              />
            </div>

            <div className="flex justify-between mt-4 items-center">
              <Typography 
                title="Provide access to calendar with alarm history and scheduled event management"
                className="font-semibold text-gray-800">
                <span className="flex items-center">
                  Calendar Features
                  <InfoIcon className="ms-2 text-blue-600 text-sm" />
                </span>
              </Typography>
              <Controller
                name="calendarFeatures"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    onChange={(e) => onChange(e.target.checked)}
                    checked={value || false}
                  />
                )}
              />
            </div>

            <div className="flex justify-between mt-4 items-center">
              <Typography 
                title="Enable user to View Product Revenue Metrics"
                className="font-semibold text-gray-800">
                <span className="flex items-center">
                  Product Revenue Metrics
                  <InfoIcon className="ms-2 text-blue-600 text-sm" />
                </span>
              </Typography>
              <Controller
                name="productRevenueMetrics"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    onChange={(e) => onChange(e.target.checked)}
                    checked={value || false}
                  />
                )}
              />
            </div>

            <div className="flex justify-between mt-4 items-center">
              <Typography 
                title="Enable user to View Assignment Metrics"
                className="font-semibold text-gray-800">
                <span className="flex items-center">
                  Assignment Metrics
                  <InfoIcon className="ms-2 text-blue-600 text-sm" />
                </span>
              </Typography>
              <Controller
                name="assignmentMetrics"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    onChange={(e) => onChange(e.target.checked)}
                    checked={value || false}
                  />
                )}
              />
            </div>
            {
              planType === "custom" && (
                <div className="flex justify-between mt-4 items-center">
                  <Typography 
                    title="Disable renewal of this plan"
                    className="font-semibold text-gray-800">
                    <span className="flex items-center">
                      Renewal Not Allowed
                      <InfoIcon className="ms-2 text-blue-600 text-sm" />
                    </span>
                  </Typography>
                  <Controller
                    name="renewalNotAllowed"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Checkbox
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          onChange(isChecked);
                        }}
                        checked={value || false}
                      />
                    )}
                  />
                </div>)
            }
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
                Attendee Filters and Exports
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
              regularDurations={regularDurations}
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
