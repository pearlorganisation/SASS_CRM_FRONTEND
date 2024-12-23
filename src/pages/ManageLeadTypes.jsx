import React, { useState } from "react";
import { TextField, Button, InputAdornment } from "@mui/material";

const LeadTypesForm = () => {
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState("#000000"); // Default black color

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      label: newLabel,
      color: newColor,
    });
    // Reset form fields
    setNewLabel("");
    setNewColor("#000000");
  };

  return (
    <div className="pt-20 flex flex-col items-center space-y-8">
      <h2 className="text-2xl font-bold text-gray-700">Manage Lead Types</h2>
      <form
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6"
        onSubmit={handleSubmit}
      >
        {/* Label Input */}
        <TextField
          fullWidth
          label="Label"
          variant="outlined"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Enter label"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🔖</InputAdornment>
            ),
          }}
        />

        {/* Color Picker */}
        <div className=" flex gap-5 items-center ">
          <label htmlFor="color-picker" className="block text-gray-600">
            Pick a Color
          </label>
          <input
            type="color"
            id="color-picker"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="w-20 h-8 cursor-pointer border rounded-full"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className="bg-blue-500 hover:bg-blue-600"
        >
          Add Lead Type
        </Button>
      </form>
    </div>
  );
};

export default LeadTypesForm;
