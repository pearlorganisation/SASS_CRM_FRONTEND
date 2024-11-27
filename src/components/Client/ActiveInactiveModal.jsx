import React, { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ActiveInactiveModal = ({ clientData, setModal, handleAction }) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsInputValid(e.target.value === clientData.email);
  };

  const handleConfirmAction = () => {
    if (inputValue === "") {
      setIsInputValid(false);
      return;
    }
    if (isInputValid) {
      handleAction(clientData.id);
    }
  };

  return (
    <div className="fixed inset-0 p-4 flex justify-center items-center z-[1000] bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-md shadow-lg p-6 relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Confirm Action</h2>
          <Tooltip title="Close">
            <IconButton
              onClick={() => setModal(false)}
              className="text-gray-600 hover:text-black"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>

        {/* Modal Content */}
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            To proceed, copy and paste the email below into the input field:
          </p>
          <p className="text-sm font-medium bg-gray-100 p-2 rounded border mb-6">
            {clientData.email}
          </p>
          <div className="relative pb-5">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter the email to confirm"
              className={`w-full p-2 rounded-md border ${
                isInputValid ? "border-gray-300" : "border-red-500"
              }`}
            />
            {!isInputValid && (
              <p className="text-red-500 text-sm mt-1">
                The email entered does not match.
              </p>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col space-y-2 mt-6">
          <button
            onClick={handleConfirmAction}
            disabled={!isInputValid}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              isInputValid
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {clientData.isActive ? "Set as Inactive" : "Set as Active"}
          </button>
          <button
            onClick={() => setModal(false)}
            className="px-6 py-2 rounded-md bg-gray-200 text-black font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveInactiveModal;
