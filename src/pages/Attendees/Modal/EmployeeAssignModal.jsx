import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRoles from "../../../hooks/useRoles";
import { addAssign } from "../../../features/actions/assign";
import useAddUserActivity from "../../../hooks/useAddUserActivity";
import { getAssignedEmployees } from "../../../features/actions/webinarContact";
import AssignedEmployeeTable from "../../../components/Webinar/AssignedEmployeeTable";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";

function EmployeeAssignModal({
  selectedRows,
  webinarId,
  tabValue,
  setAssignModal,
}) {
  const dispatch = useDispatch();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();

  const { isSuccess, isLoading: isAssignLoading } = useSelector(
    (state) => state.assign
  );
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { assignedEmployees } = useSelector((state) => state.webinarContact);
  console.log("assignedEmployees", assignedEmployees);

  const selectedType =
    tabValue === "preWebinar" ? "EMPLOYEE REMINDER" : "EMPLOYEE SALES";

  // Filter employees based on the selected role
  const options = assignedEmployees
    .filter((item) => roles.getRoleNameById(item?.role) === selectedType)
    .map((item) => ({
      value: item?._id,
      label: item?.userName,
      contactCount: item?.dailyContactCount || 0,
      contactLimit: item?.dailyContactLimit || 0,
    }));

  const handleAssign = () => {
    if (selectedEmployee) {
      const employee = options.find((item) => item.value === selectedEmployee);
      if (
        employee &&
        ((employee.contactLimit - employee.contactCount) < selectedRows.length)
      ) {
        toast.error(
          `Cannot assign more than ${
            employee.contactLimit - employee.contactCount
          } attendees to this employee.`
        );
        return;
      }

      dispatch(
        addAssign({
          webinar: webinarId ,
          user: selectedEmployee,
          attendees : selectedRows,
          recordType: tabValue
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
    setAssignModal(false);
    setSelectedEmployee(null);
  };

  useEffect(() => {
    dispatch(getAssignedEmployees(webinarId));
  }, [webinarId]);

  useEffect(() => {
    if (isAssignLoading) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }, [isAssignLoading]);

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  return (
    <div className="fixed inset-0 top-0 flex z-50 items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto mt-20 space-y-4">
        {/* Modal Header */}
        <div className="text-gray-800 font-semibold text-xl">
          <h2>Select an Employee</h2>
        </div>

        {/* Employee Options */}
        <AssignedEmployeeTable
          options={options}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          moveToPullbacks={false}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={handleAssign}
            disabled={!selectedEmployee || isLoading || isAssignLoading}
            className={`${
              !selectedEmployee
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 px-6 rounded-md transition-all duration-200`}
          >
            {isLoading ? <ClipLoader color="#fff" size={20} /> : "Assign"}
          </button>
          <button
            onClick={onClose}
            className="border border-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-200 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAssignModal;
