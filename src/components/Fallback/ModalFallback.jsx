import React from "react";

const ModalFallback = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full border-4 border-t-4 border-white w-16 h-16 mb-4"></div>
      <p className="text-white font-semibold">Loading...</p>
    </div>
  </div>
);

export default ModalFallback;
