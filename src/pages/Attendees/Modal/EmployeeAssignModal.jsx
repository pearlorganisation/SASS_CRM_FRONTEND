import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../features/slices/modalSlice";

function EmployeeAssignModal({ modalName, onAssign }) {
  const dispatch = useDispatch();
  const { modals } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Dummy employee data
  const employeeData = [
    { _id: "1", userName: "Alice Johnson", role: { name: "Manager" } },
    { _id: "2", userName: "Bob Smith", role: { name: "Developer" } },
    { _id: "3", userName: "Charlie Brown", role: { name: "Manager" } },
  ];

  const selectedType = "Manager"; // Dummy selected type

  // Filter employees based on the selected role
  const options = employeeData
    .filter((item) => item?.role?.name === selectedType)
    .map((item) => ({
      value: item?._id,
      label: item?.userName,
    }));

  const handleAssign = () => {
    if (selectedEmployee) {
      onAssign(selectedEmployee); // Callback to assign employee
    }
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
    setSelectedEmployee(null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto mt-20 space-y-4"
        sx={{ outline: "none" }}
      >
        {/* Modal Header */}
        <Typography variant="h6" className="text-gray-800 font-semibold">
          Select an Employee
        </Typography>

        {/* Employee Options */}
        <RadioGroup
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="space-y-3"
        >
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio color="primary" />}
              label={<span className="text-gray-700">{option.label}</span>}
              className="flex items-center"
            />
          ))}
        </RadioGroup>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedEmployee}
            onClick={handleAssign}
            className="capitalize"
          >
            Assign
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            className="capitalize"
          >
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default EmployeeAssignModal;
