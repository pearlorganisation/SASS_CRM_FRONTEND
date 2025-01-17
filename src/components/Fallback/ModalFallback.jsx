import React from "react";
import { createPortal } from "react-dom";
import { ClipLoader } from "react-spinners";

const ModalFallback = () =>
  createPortal(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
      <div className=" rounded-lg p-6 w-full max-w-md text-center">
        <div className="flex justify-center items-center">
          <ClipLoader color="#3b82f6" size={50} />
        </div>
        <p className="text-gray-700 mt-4">Loading...</p>
      </div>
    </div>,
    document.body
  );

export default ModalFallback;
