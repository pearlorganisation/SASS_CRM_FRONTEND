import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRoles from "../../../hooks/useRoles";
import { addAssign } from "../../../features/actions/assign";
import useAddUserActivity from "../../../hooks/useAddUserActivity";
import { getAssignedEmployees } from "../../../features/actions/webinarContact";

function EmployeeAssignModal({ selectedRows, webinarId, tabValue, setAssignModal }) {
  const dispatch = useDispatch();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();

  const { isSuccess } = useSelector((state) => state.assign);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const { assignedEmployees } = useSelector((state) => state.webinarContact);

  const selectedType =
    tabValue === "preWebinar" ? "EMPLOYEE REMINDER" : "EMPLOYEE SALES";

  // Filter employees based on the selected role
  const options = assignedEmployees
    .filter((item) => roles.getRoleNameById(item?.role) === selectedType)
    .map((item) => ({
      value: item?._id,
      label: item?.userName,
    }));

  const handleAssign = () => {
    if (selectedEmployee) {
      dispatch(
        addAssign({
          webinar: webinarId,
          employee: selectedEmployee,
          assignments: selectedRows,
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
  }, [dispatch, webinarId]);

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
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={option.value}
                name="employee"
                value={option.value}
                checked={selectedEmployee === option.value}
                onChange={() => setSelectedEmployee(option.value)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={option.value} className="ml-3 text-gray-700">
                {option.label}
              </label>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={handleAssign}
            disabled={!selectedEmployee}
            className={`${
              !selectedEmployee
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 px-6 rounded-md transition-all duration-200`}
          >
            Assign
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
