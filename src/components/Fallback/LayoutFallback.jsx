import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="flex h-screen bg-gray-100 animate-pulse">
      {/* Sidebar Skeleton */}

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-gray-200 flex items-center px-6">
          <div className="flex items-center gap-4 justify-between w-full">
            <div className="flex items-center gap-5">
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
              <div className="h-8 w-36 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-center gap-5">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
              <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          <aside className="hidden md:block w-64 border-t border-neutral-300 bg-gray-200">
            <div className="py-6 px-5">
              <div className="flex gap-4 items-center">
                <div className="h-8 w-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 flex-1 bg-gray-300 rounded mb-4"></div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-8 w-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 flex-1 bg-gray-300 rounded mb-4"></div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-8 w-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 flex-1 bg-gray-300 rounded mb-4"></div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-8 w-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 flex-1 bg-gray-300 rounded mb-4"></div>
              </div>
              <div className="flex gap-4 items-center">
                <div className="h-8 w-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-6 flex-1 bg-gray-300 rounded mb-4"></div>
              </div>
            </div>
          </aside>
          {/* Content Skeleton */}
          <main className="flex-1 p-4">
            {/* <div className="space-y-4">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-5/6"></div>
            </div> */}
          </main>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
