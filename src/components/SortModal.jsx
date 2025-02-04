import React, { useState } from "react";

const SortModal = (props) => {
  const { sortByOptions = [], onSortApply, setSortVisible, sortBy } = props;
  console.log(sortByOptions);
  const [sortByState, setSortByState] = useState(sortBy);

  return (
    <div className="absolute top-12 z-50 right-0 w-72 bg-white rounded-md shadow-lg p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Sort By</label>
          <select
            value={sortByState.sortBy}
            onChange={(e) =>
              setSortByState((prev) => ({
                ...prev,
                sortBy: e.target.value,
              }))
            }
            className="border rounded-md p-2 text-sm"
          >
            {sortByOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Order</label>
          <select
            value={sortByState.sortOrder}
            onChange={(e) =>
              setSortByState((prev) => ({
                ...prev,
                sortOrder: e.target.value,
              }))
            }
            className="border rounded-md p-2 text-sm"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <button
          onClick={() => {
            onSortApply(sortByState);
            setSortVisible(false);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
        >
          Apply Sort
        </button>
      </div>
    </div>
  );
};

export default SortModal;
