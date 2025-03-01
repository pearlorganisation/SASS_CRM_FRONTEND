import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addEmployee,
  getEmployee,
  updateEmployee,
} from "../../features/actions/employee";
import { useNavigate, useParams } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import { clearSuccess } from "../../features/slices/employee";
import { getRoleNameByID } from "../../utils/roles";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import FormInput from "../../components/FormInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import tagsService from "../../services/tagsService";

const CreateEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const logUserActivity = useAddUserActivity();
  const [tagData, setTagData] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      role: "",
      tags: [],
    },
  });
  const { userData, subscription } = useSelector((state) => state.auth);
  const employeeInactivity = subscription?.plan?.employeeInactivity;
  const { isLoading, isSuccess, singleEmployeeData } = useSelector(
    (state) => state.employee
  );

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = (data) => {
    const newData = {
      ...data,
      validCallTime: isNaN(Number(data.validCallTime))
        ? 0
        : Number(data.validCallTime),
      dailyContactLimit: isNaN(Number(data.dailyContactLimit))
        ? 0
        : Number(data.dailyContactLimit),
      adminId: userData?._id,
    };
    if (id) {
      dispatch(updateEmployee({ id, data: newData }));
    } else {
      dispatch(addEmployee(newData));
    }

    logUserActivity({
      action: id ? "edit" : "create",
      type: "Employee",
      detailItem: newData?.userName,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/employees");
    }
    return () => dispatch(clearSuccess());
  }, [isSuccess]);

  // Numeric validation (positive values only)
  const numericValidation = (value) => {
    return /^[0-9]+$/.test(value) || "Only positive numbers are allowed";
  };

  useEffect(() => {
    reset({});
    if (singleEmployeeData && id) {
      const roleName = getRoleNameByID(singleEmployeeData?.role)
        .split(" ")
        .join("_");
      reset({
        role: roleName,
        userName: singleEmployeeData?.userName,
        email: singleEmployeeData?.email,
        phone: singleEmployeeData?.phone,
        validCallTime: singleEmployeeData?.validCallTime,
        dailyContactLimit: singleEmployeeData?.dailyContactLimit,
        inactivityTime: singleEmployeeData?.inactivityTime || 10,
        tags: singleEmployeeData?.tags || [],
      });
    }
  }, [singleEmployeeData]);

  useEffect(() => {
    if (id) {
      dispatch(getEmployee(id));
    }
    return () => {
      reset();
    };
  }, [id]);

  useEffect(() => {
    tagsService.getTags().then((res) => {
      if (res.success) {
        setTagData(res.data);
      }
    });
  }, []);

  return (
    <div className="p-10">
      <div className="mt-10">
        <div className="flex justify-center"></div>
        <div className="bg-white rounded-lg shadow-lg sm:rounded-lg sm:max-w-5xl mt-8 mx-auto">
          <h3 className="text-gray-700 text-base text-center bg-gray-100 font-medium sm:text-xl p-2 rounded-t-lg uppercase">
            {id ? "Update" : "Add"} Employee
          </h3>
          <form
            className="space-y-6 mx-8 sm:mx-2 p-4 py-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="sm:grid sm:grid-cols-2 sm:gap-6">
              {/* User Name */}
              <div className="w-full">
                <FormInput
                  name="userName"
                  label="User Name"
                  control={control}
                  validation={{
                    required: "User Name is required",
                  }}
                />
              </div>
              {/* Email */}

              <div className="w-full">
                <FormInput
                  name="email"
                  label="Email"
                  control={control}
                  validation={{ required: "Email is required" }}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-2 sm:gap-6">
              {/* Valid Call Time (seconds) */}
              <div className="w-full">
                {/* <TextField
                  {...register("", )}
                  
                  type="number"
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.validCallTime)}
                  helperText={errors.validCallTime?.message}
                  className="mt-2"
                  inputProps={{ min: 0 }}
                /> */}
                <FormInput
                  name="validCallTime"
                  label="Valid Call Time (seconds)"
                  control={control}
                  validation={{
                    required: "Valid Call Time is required",
                    validate: numericValidation,
                  }}
                />
              </div>

              {/* Daily Contact Limit */}
              <div className="w-full">
                <FormInput
                  name="dailyContactLimit"
                  label="Daily Contact Limit"
                  control={control}
                  validation={{
                    required: "Daily Contact Limit is required",
                    validate: numericValidation,
                  }}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-2 sm:gap-6">
              {/* Phone Number */}
              <div className="w-full">
                <FormInput
                  name="phone"
                  label="Phone Number"
                  placeholder="+91 1234567890"
                  control={control}
                  validation={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^\+\d{1,3}\d{9}$/,
                      message:
                        "10 Digit Phone number with Country Code is required, eg: +911234567890",
                    },
                  }}
                />
              </div>
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
            </div>
            <div className="sm:grid sm:grid-cols-2 sm:gap-6">
              {employeeInactivity && (
                <FormInput
                  name="inactivityTime"
                  label="Inactivity Time (Seconds)"
                  control={control}
                  type="number"
                  validation={{
                    required: "Inactivity Time is required",
                    min: {
                      value: 1,
                      message: "Value must be at least 1",
                    },
                  }}
                />
              )}

              {/* Employee Type */}
              {!id && (
                <div className="w-full">
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={!!errors.role}
                  >
                    <InputLabel>Employee Type</InputLabel>
                    <Controller
                      control={control}
                      name="role"
                      rules={{ required: "Role is required" }}
                      render={({ field }) => (
                        <Select {...field} label="Employee Type">
                          <MenuItem value="" disabled>
                            Choose Employee Type
                          </MenuItem>
                          <MenuItem value="EMPLOYEE_SALES">Sales</MenuItem>
                          <MenuItem value="EMPLOYEE_REMINDER">
                            Reminder
                          </MenuItem>
                        </Select>
                      )}
                    />
                    {errors.role && (
                      <FormHelperText>{errors.role.message}</FormHelperText>
                    )}
                  </FormControl>
                </div>
              )}
            </div>

            <div className="sm:grid sm:grid-cols-2 sm:gap-6">
              {/* Password */}
              <div className="w-full">
                <TextField
                  {...register("password", {
                    required: id ? false : "Password is required",
                  })}
                  label="Password"
                  type={showPassword.password ? "text" : "password"}
                  fullWidth
                  variant="outlined"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility("password")}
                        >
                          {showPassword.password ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Confirm Password */}
              <div className="w-full">
                <TextField
                  {...register("confirmPassword", {
                    required: id ? false : "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  label="Confirm Password"
                  type={showPassword.confirmPassword ? "text" : "password"}
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
                        >
                          {showPassword.confirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="btn-grad"
              >
                {isLoading ? (
                  <ClipLoader color="#fff" size={20} />
                ) : id ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
