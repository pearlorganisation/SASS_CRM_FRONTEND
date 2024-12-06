import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const FormInput = ({
  name,
  label,
  control,
  defaultValue = "",
  type = "text",
  required = false,  // Added required prop
  errorMessage = "This field is required",  // Custom error message
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: required ? errorMessage : false,  // Only apply the required rule if `required` is true
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          fullWidth
          type={type}
          value={type === "number" ? field.value ?? "" : field.value} // Ensure empty value is handled correctly
          onChange={(e) =>
            field.onChange(
              type === "number" ? parseFloat(e.target.value) || "" : e.target.value
            )
          }
          error={!!fieldState?.error}  // Show error if there's an error
          helperText={fieldState?.error?.message}  // Display the error message
        />
      )}
    />
  );
};

export default FormInput;
