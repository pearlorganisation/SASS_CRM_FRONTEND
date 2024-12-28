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
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import { clearSuccess } from "../../features/slices/employee";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import { getRoleNameByID } from "../../utils/roles";
import useRoles from "../../hooks/useRoles";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import FormInput from "../../components/FormInput";

const CreateEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();

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
    },
  });
  const { userData } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, singleEmployeeData } = useSelector(
    (state) => state.employee
  );

  const onSubmit = (data) => {
    console.log(userData);
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
    console.log(newData);
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

  const [isPasswordHidden, setPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => {
    setPasswordHidden(!isPasswordHidden);
    const passwordInput = document.getElementById("hs-toggle-password");
    if (passwordInput) {
      passwordInput.type = isPasswordHidden ? "text" : "password";
    }
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
                <TextField
                  {...register("userName", {
                    required: "User Name is required",
                  })}
                  label="User Name"
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.userName)}
                  helperText={errors.userName?.message}
                  className="mt-2"
                />
              </div>
              {/* Email */}

              <div className="w-full">
                <TextField
                  {...register("email", { required: "Email is required" })}
                  label="Email"
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-2 sm:gap-6">
              {/* Valid Call Time (seconds) */}
              <div className="w-full">
                <TextField
                  {...register("validCallTime", {
                    required: "Valid Call Time is required",
                    validate: numericValidation,
                  })}
                  label="Valid Call Time (seconds)"
                  type="number"
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.validCallTime)}
                  helperText={errors.validCallTime?.message}
                  className="mt-2"
                  inputProps={{ min: 0 }}
                />
              </div>

              {/* Daily Contact Limit */}
              <div className="w-full">
                <TextField
                  {...register("dailyContactLimit", {
                    required: "Daily Contact Limit is required",
                    validate: numericValidation,
                  })}
                  label="Daily Contact Limit"
                  type="number"
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.dailyContactLimit)}
                  helperText={errors.dailyContactLimit?.message}
                  className="mt-2"
                  inputProps={{ min: 0 }}
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-2 sm:gap-6">
              {/* Phone Number */}
              <div className="w-full">
                <TextField
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be numeric and 10 digits",
                    },
                  })}
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                  className="mt-2"
                />
              </div>

              {id && (
                <FormInput
                  name="inactivityTime"
                  label="Inactivity Time (Minutes)"
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

            {!id ? (
              <div className="sm:grid sm:grid-cols-2 sm:gap-6">
                {/* Password */}
                <div className="w-full">
                  <TextField
                    {...register("password", {
                      required: "Password is required",
                    })}
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    error={Boolean(errors.password)}
                    helperText={errors.password?.message}
                    className="mt-2"
                  />
                </div>

                {/* Confirm Password */}
                <div className="w-full">
                  <TextField
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") ||
                        "The passwords do not match",
                    })}
                    id="hs-toggle-password"
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword?.message}
                    className="mt-2"
                  />
                </div>
              </div>
            ) : (
              <></>
            )}

            {!id && (
              <div className="sm:grid sm:grid-cols-2 sm:gap-6">
                <FormInput
                  name="inactivityTime"
                  label="Inactivity Time (Minutes)"
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
              </div>
            )}

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
