import React, { useEffect, useState } from "react";
import {
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Checkbox,
  Modal,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";
import { getAssignedEmployees } from "../../features/actions/webinarContact";
import useRoles from "../../hooks/useRoles";
import {
  changeAssignment,
  moveAttendeesToPullbacks,
} from "../../features/actions/reAssign";

const ReAssignmentModal = ({
  modalName,
  tabValue,
  webinarid,
  selectedRows,
  isPullbackVisible=false,
}) => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const [assignmentType, setAssignmentType] = useState("temporary");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [moveToPullbacks, setMoveToPullbacks] = useState(false);
  const { reAssignData, isSuccess } = useSelector((state) => state.reAssign);
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
    if (moveToPullbacks && isPullbackVisible) {
      const payload = {
        recordType: tabValue,
        webinarId: webinarid,
        attendees: selectedRows.map((id) => id),
      };
      console.log("Pullbacks Payload:", payload);
      // Dispatch your specific action for "Move to Pullbacks"
      dispatch(moveAttendeesToPullbacks(payload));
    } else {
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
    }
  };

  const handleCancel = () => {
    dispatch(closeModal(modalName));
    setAssignmentType("temporary");
    setSelectedEmployee("");
    setMoveToPullbacks(false);
  };

  useEffect(() => {
    if (open) {
      dispatch(getAssignedEmployees(webinarid));
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess) {
      handleCancel();
    }

    return () => {
      if(isSuccess){

      }
    }
  },[isSuccess]);

  return (
    <Modal open={open} onClose={handleCancel}>
      <Box
        className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-20"
        sx={{ outline: "none" }}
      >
        <h2 className="text-lg font-bold mb-4 border-b">Re-Assign Attendee</h2>

        {/* Move to Pullbacks */}
        {
          isPullbackVisible && (
            <div className="mb-4">
          <FormControlLabel
            control={
              <Checkbox
                checked={moveToPullbacks}
                onChange={(e) => setMoveToPullbacks(e.target.checked)}
              />
            }
            label="Move to Pullbacks"
          />
        </div>
          )
        }

        {/* Assignment Type */}
        <div className="mb-4">
          <label className="block font-medium mb-2">
            Select Assignment Type
          </label>
          <RadioGroup
            value={assignmentType}
            onChange={(e) => setAssignmentType(e.target.value)}
            className="flex flex-col space-y-2"
          >
            <FormControlLabel
              value="temporary"
              control={<Radio />}
              label="Temporary"
              disabled={moveToPullbacks}
            />
            <FormControlLabel
              value="permanent"
              control={<Radio />}
              label="Permanent"
              disabled={moveToPullbacks}
            />
          </RadioGroup>
        </div>

        {/* Employees */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Select Employee</label>
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
                disabled={moveToPullbacks}
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
            disabled={!selectedEmployee && !moveToPullbacks}
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
