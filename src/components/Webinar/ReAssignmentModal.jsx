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
  fetchPullbackRequestCounts,
  moveAttendeesToPullbacks,
} from "../../features/actions/reAssign";
import { resetReAssignSuccess } from "../../features/slices/reAssign.slice";
import AssignedEmployeeTable from "./AssignedEmployeeTable";
import { getAllEmployees } from "../../features/actions/employee";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

const ReAssignmentModal = ({
  tabValue,
  webinarid,
  selectedRows,
  isPullbackVisible = false,
  isAttendee = false,
  setReAssignModal,
}) => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const [assignmentType, setAssignmentType] = useState("temporary");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [moveToPullbacks, setMoveToPullbacks] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    reAssignData,
    isSuccess,
    isLoading: reassignLoading,
  } = useSelector((state) => state.reAssign);
  const { employeeData: assignedEmployees } = useSelector(
    (state) => state.employee
  );

  const selectedType =
    tabValue === "preWebinar" ? "EMPLOYEE_REMINDER" : "EMPLOYEE_SALES";

  const options = assignedEmployees
    .filter((item) => item?.role === selectedType)
    .map((item) => ({
      value: item?._id,
      label: item?.userName,
      contactCount: item?.dailyContactCount || 0,
      contactLimit: item?.dailyContactLimit || 0,
    }));

  const handleSubmit = () => {
    if (isAttendee && isPullbackVisible) {
      if (moveToPullbacks) {
        const payload = {
          recordType: tabValue,
          webinarId: webinarid,
          attendees: selectedRows,
        };
        // Dispatch your specific action for "Move to Pullbacks"
        dispatch(moveAttendeesToPullbacks(payload));
      } else {
        const employee = options.find(
          (item) => item.value === selectedEmployee
        );
        if (
          employee &&
          employee.contactLimit - employee.contactCount < selectedRows.length
        ) {
          toast.error(
            `Cannot assign more than ${
              employee.contactLimit - employee.contactCount
            } attendees to this employee.`
          );
          return;
        }
        const payload = {
          isTemp: assignmentType === "temporary" ? true : false,
          employeeId: selectedEmployee,
          webinarId: webinarid,
          recordType: tabValue,
          attendees: selectedRows,
        };
        dispatch(moveAttendeesToPullbacks(payload))
      }
    } else {
      const employee = options.find((item) => item.value === selectedEmployee);
      console.log("employee ---- > ", employee);
      if (
        employee &&
        employee.contactLimit - employee.contactCount < selectedRows.length
      ) {
        toast.error(
          `Cannot assign more than ${
            employee.contactLimit - employee.contactCount
          } attendees to this employee.`
        );
        return;
      }

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
      dispatch(changeAssignment(payload))
    }
  };

  const handleCancel = () => {
    setReAssignModal(false);
    setAssignmentType("temporary");
    setSelectedEmployee("");
    setMoveToPullbacks(false);
  };

  useEffect(() => {
    dispatch(
      getAllEmployees({ page: 1, limit: 100, filters: { isActive: "active" } })
    );
  }, []);

  useEffect(() => {
    if (isSuccess) {
      handleCancel();
      dispatch(
        fetchPullbackRequestCounts({
          webinarId: webinarid,
          status: "active",
          recordType: tabValue,
        })
      );
    }

    return () => {
      if (isSuccess) {
        dispatch(resetReAssignSuccess());
      }
    };
  }, [isSuccess]);

  useEffect(() => {
    if (reassignLoading) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }, [reassignLoading]);

  return (
    <Modal open={true} onClose={handleCancel}>
      <Box
        className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto mt-20"
        sx={{ outline: "none" }}
      >
        <h2 className="text-lg font-bold mb-4 border-b">Re-Assign Attendee</h2>

        {/* Move to Pullbacks */}
        {isPullbackVisible && (
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
        )}

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
        <AssignedEmployeeTable
          options={options}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          moveToPullbacks={moveToPullbacks}
        />

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button onClick={handleCancel} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              (!selectedEmployee && !moveToPullbacks) ||
              isLoading ||
              reassignLoading
            }
            variant="contained"
          >
            {reassignLoading ? <ClipLoader color="#fff" size={20} /> : "Assign"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ReAssignmentModal;
