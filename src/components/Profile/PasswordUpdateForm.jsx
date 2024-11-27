import { Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

function PasswordUpdateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = (data) => {
    console.log("Password updated successfully", data);
    // Your updatePassword function logic
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Update Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Current Password Field */}
        <div>
          <TextField
            {...register("currentPassword", {
              required: "Current password is required.",
            })}
            label="Current Password"
            type="password"
            fullWidth
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
          />
        </div>

        {/* New Password Field */}
        <div>
          <TextField
            {...register("newPassword", {
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
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
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
          Update Password
        </Button>
      </form>
    </div>
  );
}

export default PasswordUpdateForm;
