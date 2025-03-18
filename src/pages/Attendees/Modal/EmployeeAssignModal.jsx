import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useRoles from "../../../hooks/useRoles";
import { addAssign } from "../../../features/actions/assign";
import useAddUserActivity from "../../../hooks/useAddUserActivity";
import { getAssignedEmployees } from "../../../features/actions/webinarContact";
import AssignedEmployeeTable from "../../../components/Webinar/AssignedEmployeeTable";
import { toast } from "sonner";
import { clearAssignedEmployees } from "../../../features/slices/webinarContact";
import TailwindLoader from "../../../components/TailwindLoader";
import { errorToast } from "../../../utils/extra";

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
  const [forceAssign, setForceAssign] = useState(false);
  const { assignedEmployees, isLoading: fetchLoading } = useSelector(
    (state) => state.webinarContact
  );

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
        !forceAssign &&
        employee &&
        employee.contactLimit - employee.contactCount < selectedRows.length
      ) {
        if(employee.contactLimit - employee.contactCount < 0){
          errorToast(
            `Assgignment limit exceeded for this employee.`
          );
          return;
        }
        errorToast(
          `Cannot assign more than ${
            employee.contactLimit - employee.contactCount
          } attendees to this employee.`
        );
        return;
      }

      dispatch(
        addAssign({
          webinar: webinarId,
          user: selectedEmployee,
          attendees: selectedRows,
          recordType: tabValue,
          forceAssign: forceAssign,
        })
      );
      logUserActivity({
        action: "assign",
        details: `User manually assigned Attendees to : ${
          tabValue === "preWebinar" ? "REMINDER EMPLOYEE" : "SALES EMPLOYEE"
        }${forceAssign ? " (Force Assigned)" : ""}`,
      });
    }
  };

  const onClose = () => {
    setAssignModal(false);
    setSelectedEmployee(null);
  };

  useEffect(() => {
    dispatch(getAssignedEmployees(webinarId));

    return () => {
      dispatch(clearAssignedEmployees());
    };
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
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto mt-20 space-y-4">
        {/* Modal Header */}
        <div className="text-gray-800 font-semibold text-xl">
          <h2>Select an Employee</h2>
        </div>

        {/* Content Area */}

        {fetchLoading ? (
          <div className="flex flex-col gap-2 justify-center items-center py-8">
            <p className="text-gray-600">Fetching Assigned Employees...</p>
            <div className=" h-10 w-10">
              <TailwindLoader size={10} />
            </div>
          </div>
        ) : assignedEmployees.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No assigned employees found. Please assign employees first.</p>
          </div>
        ) : (
          <>
            <AssignedEmployeeTable
              options={options}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              moveToPullbacks={false}
              isLabel={false}
              forceAssign={forceAssign}
            />
            <div className="flex items-center mt-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={forceAssign}
                  onChange={() => setForceAssign(!forceAssign)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  Force Assign
                </span>
              </label>
              {forceAssign && (
                <span className="text-xs text-orange-500 ml-2">
                  This will bypass daily limit restrictions
                </span>
              )}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={handleAssign}
            disabled={
              !selectedEmployee || isLoading || isAssignLoading || fetchLoading
            }
            className={`${
              !selectedEmployee || fetchLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 px-6 rounded-md transition-all duration-200`}
          >
            {isLoading ? (
              <div className=" h-5 w-5">
                <TailwindLoader size={5} />
              </div>
            ) : (
              "Assign"
            )}
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
