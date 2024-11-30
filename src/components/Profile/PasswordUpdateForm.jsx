import { Button, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { updatePassword } from "../../features/actions/auth";

function PasswordUpdateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector((state) => state.auth);

  const newPassword = watch("password");

  const onSubmit = (data) => {
    console.log("Password updated successfully", data);
    dispatch(updatePassword(data));
    // Your updatePassword function logic
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
            type="password"
            fullWidth
            error={!!errors.oldPassword}
            helperText={errors.oldPassword?.message}
          />
        </div>

        {/* New Password Field */}
        <div>
          <TextField
            {...register("password", {
              required: "New password is required.",
              // minLength: {
              //   value: 8,
              //   message: "Password must be at least 8 characters long.",
              // },
              // validate: (value) =>
              //   /[A-Z]/.test(value) || "Password must contain at least one uppercase letter.",
            })}
            label="New Password"
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
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
            type="password"
            fullWidth
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
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
