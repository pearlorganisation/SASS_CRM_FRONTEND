import React, { useEffect, useState } from "react";
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
import { getAllEmployees } from "../../../features/actions/employee";
import useRoles from "../../../hooks/useRoles";
import { addAssign } from "../../../features/actions/assign";
import useAddUserActivity from "../../../hooks/useAddUserActivity";

function EmployeeAssignModal({ modalName, selectedRows, webinarId }) {
  const dispatch = useDispatch();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();

  const { modals } = useSelector((state) => state.modals);
  const { employeeData, isLoading } = useSelector((state) => state.employee);
  const { tabValue } = useSelector((state) => state.attendee);
  const { isSuccess } = useSelector((state) => state.assign);

  const open = modals[modalName] ? true : false;

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const selectedType =
    tabValue === "preWebinar" ? "EMPLOYEE REMINDER" : "EMPLOYEE SALES";

  // Filter employees based on the selected role
  const options = employeeData
    .map((item) => {
      return { ...item, role: roles.getRoleNameById(item?.role) };
    })
    .filter((item) => item?.role === selectedType)
    .map((item) => ({
      value: item?._id,
      label: item?.userName,
    }));

  const handleAssign = () => {
    if (selectedEmployee) {
      console.log(
        selectedEmployee,
        "selectedEmployee",
        webinarId,
        selectedRows
      );
      dispatch(
        addAssign({
          id: selectedEmployee,
          payload: {
            webinar: webinarId,
            assignments: selectedRows,
          },
        })
      );
      logUserActivity({
        action: "assign",
        details: `User manually assigned Attendees to : ${
          tabValue === "preWebinar" ? "REMINDER EMPLOYEE" : "SALES EMPLOYEE"
        }`,
      });
    }
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
    setSelectedEmployee(null);
  };

  useEffect(() => {
    dispatch(getAllEmployees());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

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
