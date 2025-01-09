import React from "react";

const FallbackPage = () => {
  return (
    <div className="w-full sm:ps-48 border h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-6 h-6 bg-blue-600 rounded-full animate-bounce delay-150"></div>
          <div className="w-6 h-6 bg-blue-600 rounded-full animate-bounce delay-300"></div>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-700">
          Loading, please wait...
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          We are preparing everything for you.
        </p>
      </div>
    </div>
  );
};

export default FallbackPage;
