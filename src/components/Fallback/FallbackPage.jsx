import React from "react";

const FallbackPage = () => {
  return (
    <div className="w-full sm:ps-48 border h-screen flex justify-center items-center">
      <div class="flex flex-col items-center">
        <div class="flex items-center justify-center space-x-2">
          <div class="w-6 h-6 bg-blue-600 rounded-full animate-bounce"></div>
          <div class="w-6 h-6 bg-blue-600 rounded-full animate-bounce delay-150"></div>
          <div class="w-6 h-6 bg-blue-600 rounded-full animate-bounce delay-300"></div>
        </div>
        <h2 class="mt-4 text-lg font-semibold text-gray-700">
          Loading, please wait...
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          We are preparing everything for you.
        </p>
      </div>
    </div>
  );
};

export default FallbackPage;
