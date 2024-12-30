import React, { useEffect, useState } from "react";
import {
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Modal,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";
import { getAssignedEmployees } from "../../features/actions/webinarContact";
import useRoles from "../../hooks/useRoles";
import { changeAssignment } from "../../features/actions/reAssign";

const ReAssignmentModal = ({
  modalName,
  tabValue,
  webinarid,
  selectedRows,
}) => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const [assignmentType, setAssignmentType] = useState("temporary");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const { reAssignData } = useSelector((state) => state.reAssign);
  const { assignedEmployees, isLoading } = useSelector(
    (state) => state.webinarContact
  );
  const { modals } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;

  const selectedType =
    tabValue === "preWebinar" ? "EMPLOYEE REMINDER" : "EMPLOYEE SALES";

  // Filter employees based on the selected role
  const options = assignedEmployees
    .filter((item) => roles.getRoleNameById(item?.role) === selectedType)
    .map((item) => ({
      value: item?._id,
      label: item?.userName,
    }));

  const handleSubmit = () => {
    const payload = {
      isTemp: assignmentType === "temporary" ? true : false,
      employeeId: selectedEmployee,
      recordType: tabValue,
      webinarId: webinarid,
      assignments: reAssignData
        .filter((item) => selectedRows.includes(item?._id))
        .map((item) => ({
          assignmentId: item?._id,
          attendeeId: item?.attendee,
        })),
    };
    console.log(payload);
    dispatch(changeAssignment(payload));
  };

  const handleCancel = () => {
    dispatch(closeModal(modalName));
    setAssignmentType("temporary");
    setSelectedEmployee("");
  };

  useEffect(() => {
    if (open) {
      dispatch(getAssignedEmployees(webinarid));
    }
  }, [open]);
  return (
    <Modal open={open} onClose={handleCancel}>
      <Box
        className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-20"
        sx={{ outline: "none" }}
      >
        <h2 className="text-lg font-semibold mb-4">Assign Task</h2>

        {/* Assignment Type */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Assignment Type</label>
          <RadioGroup
            value={assignmentType}
            onChange={(e) => setAssignmentType(e.target.value)}
            className="flex flex-col space-y-2"
          >
            <FormControlLabel
              value="temporary"
              control={<Radio />}
              label="Temporary"
            />
            <FormControlLabel
              value="permanent"
              control={<Radio />}
              label="Permanent"
            />
          </RadioGroup>
        </div>

        {/* Employees */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Employee</label>
          <RadioGroup
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="flex flex-col space-y-2"
          >
            {options.map((employee) => (
              <FormControlLabel
                key={employee?.value}
                value={employee?.value}
                control={<Radio />}
                label={employee?.label}
              />
            ))}
          </RadioGroup>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button onClick={handleCancel} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedEmployee}
            variant="contained"
          >
            Submit
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ReAssignmentModal;