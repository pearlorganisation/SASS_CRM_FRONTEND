import React, { useState } from "react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

const RequestReassignmentModal = ({ onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const { assignLoading } = useSelector((state) => state.assign);

  const handleSubmit = () => {
    if (reason.trim()) {
      console.log("Reason:", reason);
      onSubmit(reason);
    } else {
      toast.dismiss();
      toast.error("Please enter a reason for reassignment.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        {/* Modal Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Request Reassignment
          </h2>
        </div>

        {/* Reason Input Field */}
        <div className="mb-4">
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700"
          >
            Reason
          </label>
          <textarea
            id="reason"
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 block w-full rounded-md border p-2 border-gray-300 shadow-sm focus:outline-none sm:text-sm"
            placeholder="Enter the reason for reassignment..."
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            disabled={assignLoading}
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium w-20 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {assignLoading ? <ClipLoader size={16} /> : " Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestReassignmentModal;
