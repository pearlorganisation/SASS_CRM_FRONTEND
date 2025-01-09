import React from "react";

const DataTableFallback = () => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      {/* Table Header Skeleton */}
      <div className="flex gap-4 justify-between items-center mb-4">
        <div className="w-1/4 bg-gray-300 h-6 rounded-lg animate-pulse"></div>
        <div className="w-12 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
      </div>

      {/* Buttons & Filters Skeleton */}
      <div className={`flex gap-4 justify-end flex-wrap py-2 items-center mb-6`}>
        <div className="flex gap-4">
          <div className="w-24 bg-gray-300 h-8 rounded-lg animate-pulse"></div>
          <div className="w-24 bg-gray-300 h-8 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-8 gap-4 p-4 animate-pulse">
          {/* <div className=" h-8 bg-gray-300 rounded-lg"></div>
          <div className=" h-8 bg-gray-300 rounded-lg"></div>
          <div className=" h-8 bg-gray-300 rounded-lg"></div>
          <div className=" h-8 bg-gray-300 rounded-lg"></div>
          <div className=" h-8 bg-gray-300 rounded-lg"></div>
          <div className=" h-8 bg-gray-300 rounded-lg"></div>
          <div className=" h-8 bg-gray-300 rounded-lg"></div>
          <div className=" h-8 bg-gray-300 rounded-lg"></div> */}
        </div>
        <div className="p-4 animate-pulse">
          <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Pagination Skeleton */}
      {/* <div className="flex gap-4 md:flex-row flex-col flex-wrap items-center justify-between py-4 mt-4">
        <div className="w-24 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
        <div className="w-24 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
      </div> */}
    </div>
  );
};

export default DataTableFallback;
