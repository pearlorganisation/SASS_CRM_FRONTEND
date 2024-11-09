import React, { useState } from 'react';

function EmployeeAssignModal({ employeeData, selectedType, onClose, onAssign }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const options =
    Array.isArray(employeeData) &&
    employeeData
      .filter((item) => item?.role?.name === selectedType)
      .map((item) => ({
        value: item?._id,
        label: item?.userName,
      }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Select an Employee</h2>
        <form>
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={option.value}
                  name="employee"
                  value={option.value}
                  onChange={() => setSelectedEmployee(option.value)}
                  className="text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor={option.value} className="ml-2 text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => onAssign(selectedEmployee)}
              disabled={!selectedEmployee}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedEmployee
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Assign
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-gray-600 bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeAssignModal;
