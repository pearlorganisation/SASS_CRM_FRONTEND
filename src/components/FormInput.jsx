import React from "react";
import { Controller } from "react-hook-form";
import { TextField } from "@mui/material";

const FormInput = ({
  name,
  label,
  control,
  defaultValue = "",
  type = "text",
  required = false,
  errorMessage = "This field is required",
  validation = {}, // Additional dynamic validation rules
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: required ? errorMessage : false,
        ...validation, // Spread additional validation rules
      }}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          label={label}
          fullWidth
          type={type}
          value={type === "number" ? field.value ?? "" : field.value}
          onChange={(e) =>
            field.onChange(
              type === "number" ? parseFloat(e.target.value) || "" : e.target.value
            )
          }
          error={!!fieldState?.error}
          helperText={fieldState?.error?.message}
        />
      )}
    />
  );
};

export default FormInput;
