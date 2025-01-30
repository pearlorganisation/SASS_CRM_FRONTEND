import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePricePlan } from "../../../features/actions/pricePlan";
import useAddUserActivity from "../../../hooks/useAddUserActivity";

export default function PlanInactiveModal({ setModalData, modalData, planType }) {
  const logUserActivity = useAddUserActivity();
  const dispatch = useDispatch();
  const { subscription } = useSelector((state) => state.auth);

  const { isSuccess } = useSelector((state) => state.pricePlans);
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsInputValid(e.target.value === modalData?.name);
  };

  const handleConfirmAction = () => {
    if (inputValue === "") {
      setIsInputValid(false);
      return;
    }
    if (isInputValid) {
      dispatch(deletePricePlan({
        _id: modalData?._id,
        isActive: planType
      }));

      logUserActivity({
        action: "inactivate",
        details: `Inactivated plan with name: ${modalData?.name}`,
      });
    }
  };

  const handleClose = () => {
    setModalData(null);
    setInputValue("");
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess]);

  return (
    <div
      className={`fixed inset-0 z-50 `}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="text-lg font-semibold">{planType === "active" ? "Deactivate" : "Activate"} Plan</h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Confirmation Message */}
          <div className="text-center mb-6">
            <p className="text-gray-700">
              Confirm {planType === "active" ? "deactivation" : "activation"} by entering plan name:{" "}
            </p>
            <p>
              <strong className="font-semibold">{modalData?.name}</strong>
            </p>
          </div>

          {/* Input Field */}
          <div className="mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter plan name to confirm"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isInputValid
                  ? "border-gray-300 focus:ring-blue-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
            />
            {!isInputValid && (
              <p className="text-red-500 text-sm mt-1">
                The plan name entered does not match.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleConfirmAction}
              disabled={!isInputValid}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                isInputValid
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {planType === "active" ? "Deactivate" : "Activate"} Plan
            </button>
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
