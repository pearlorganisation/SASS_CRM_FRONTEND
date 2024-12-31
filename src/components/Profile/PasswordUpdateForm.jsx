import { Button, TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { updatePassword } from "../../features/actions/auth";
import useAddUserActivity from "../../hooks/useAddUserActivity";

function PasswordUpdateForm() {
  const logUserActivity = useAddUserActivity();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    password: false,
    confirmPassword: false,
  });

  const newPassword = watch("password");

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = (data) => {
    dispatch(updatePassword(data));
    logUserActivity({
      action: "update",
      details: "User updated the password",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Update Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password Field */}
        <div>
          <TextField
            {...register("oldPassword", {
              required: "Current password is required.",
            })}
            label="Current Password"
            type={showPassword.oldPassword ? "text" : "password"}
            fullWidth
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility("oldPassword")}
                  >
                    {showPassword.oldPassword ? (
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

        {/* New Password Field */}
        <div>
          <TextField
            {...register("password", {
              required: "New password is required.",
            })}
            label="New Password"
            type={showPassword.password ? "text" : "password"}
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility("password")}
                  >
                    {showPassword.password ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Confirm Password Field */}
        <div>
          <TextField
            {...register("confirmPassword", {
              required: "Please confirm your password.",
              validate: (value) =>
                value === newPassword || "Passwords do not match.",
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
                    onClick={() => togglePasswordVisibility("confirmPassword")}
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

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isLoading ? (
            <ClipLoader color="#fff" size={20} />
          ) : (
            "Update Password"
          )}
        </Button>
      </form>
    </div>
  );
}

export default PasswordUpdateForm;
