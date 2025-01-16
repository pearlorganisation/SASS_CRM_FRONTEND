import React, { useState } from "react";
import Select from "react-select";
import { toast } from "sonner";
import { attendeeTableColumns } from "../../utils/columnData";

const SwapAttendeeFieldsModal = ({ onClose, onSubmit }) => {
  const [field1, setField1] = useState(null);
  const [field2, setField2] = useState(null);

  const customStyles = {
    menu: (provided) => ({
      ...provided,
      maxHeight: "150px",
      overflowY: "auto", // Ensure overflow is set to auto for scrolling
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "150px",
      padding: 0, // Ensure no padding interferes with scrolling
    }),
  };

  const handleCancel = () => {
    setField1(null);
    setField2(null);
    onClose();
  };

  const handleSubmit = () => {
    if (field1 && field2) {
      onSubmit(field1.value, field2.value);
      handleCancel(); // Close and reset form after submission
    } else {
      toast.dismiss();
      toast.error("Please select both fields.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Swap Attendee Fields</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Field 1</label>
          <Select
            value={field1}
            onChange={setField1}
            options={attendeeTableColumns
              .filter(
                (column) =>
                  column.key !== "isAssigned" &&
                  column.key !== "status" &&
                  column.key !== "timeInSession"
              )
              .map((column) => ({
                value: column.key,
                label: column.header,
              }))}
            placeholder="Select Field 1"
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customStyles}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Field 2</label>
          <Select
            value={field2}
            onChange={setField2}
            options={attendeeTableColumns
              .filter(
                (column) =>
                  column.key !== "isAssigned" &&
                  column.key !== "status" &&
                  column.key !== "timeInSession"
              )
              .map((column) => ({
                value: column.key,
                label: column.header,
              }))}
            placeholder="Select Field 2"
            className="react-select-container"
            classNamePrefix="react-select"
            styles={customStyles}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwapAttendeeFieldsModal;
