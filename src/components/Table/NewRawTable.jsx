import { useState } from "react";
import { formatDateAsNumber } from "../../utils/extra";

const RawTable = (props) => {
  const {
    tableData,
    actions,
    isSelectVisible,
    page,
    limit,
    isLoading,
    selectedRows,
    setSelectedRows,
    rowClick = (row) => {
      // console.log("Row clicked:", row);
    },
    isRowClickable = false,
    isLeadType = false,
    userData,
  } = props;

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const isRowSelected = (id) => {
    return selectedRows.includes(id);
  };

  const areAllSelected = selectedRows.length === tableData?.rows?.length;

  const handleSelectAllChange = (checked) => {
    if (checked) {
      setSelectedRows(tableData?.rows?.map((row) => row._id));
    } else {
      setSelectedRows([]);
    }
  };

  return (
    <div className="overflow-x-auto shadow-md">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">S.No</th>
            {isSelectVisible && (
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  className="cursor-pointer"
                  checked={areAllSelected}
                  onChange={(e) => handleSelectAllChange(e.target.checked)}
                />
              </th>
            )}
            {tableData?.columns?.map((column, index) => (
              <th key={index} className="px-4 py-2 text-left whitespace-nowrap">
                {column.header}
              </th>
            ))}
            <th className="px-4 py-2 text-left sticky right-0 bg-gray-100 z-10">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            // Display skeletons while loading
            Array.from({ length: limit <= 10 ? limit : 10 }).map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <div className="animate-pulse bg-gray-300 h-5 w-full" />
                </td>
                {isSelectVisible && (
                  <td className="px-4 py-2">
                    <input type="checkbox" disabled className="cursor-not-allowed" />
                  </td>
                )}
                {tableData?.columns?.map((column, index) => (
                  <td key={index} className="px-4 py-2">
                    <div className="animate-pulse bg-gray-300 h-5 w-full" />
                  </td>
                ))}
                <td className="px-4 py-2">
                  <div className="animate-pulse bg-gray-300 h-8 w-8 rounded-full" />
                </td>
              </tr>
            ))
          ) : tableData?.rows?.length > 0 ? (
            // Display actual data when not loading and rows are available
            tableData?.rows?.map((row, index) => (
              <tr
                key={row?._id}
                className={`${isRowSelected(row?._id) ? "bg-blue-50" : "bg-white"} hover:bg-gray-50`}
              >
                <td
                  className={`px-4 py-2 ${isRowClickable ? "cursor-pointer" : ""}`}
                  onClick={() => rowClick(row)}
                >
                  <div className={`flex items-center justify-between ${!isLeadType ? "px-3" : ""}`}>
                    {isLeadType && (
                      <div
                        className="w-2 h-full"
                        style={{
                          backgroundColor: row?.leadType?.color || "transparent",
                          borderRadius: "5%",
                        }}
                      />
                    )}
                    {(page - 1) * limit + index + 1}
                  </div>
                </td>
                {isSelectVisible && (
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={isRowSelected(row?._id)}
                      onChange={() => handleCheckboxChange(row?._id)}
                    />
                  </td>
                )}
                {tableData?.columns?.map((column, index) => (
                  <td
                    key={index}
                    className={`px-4 py-2 ${isRowClickable ? "cursor-pointer" : ""}`}
                    onClick={() => rowClick(row)}
                  >
                    {column.type === "status" && (
                      <span
                        className={`inline-block py-1 px-2 rounded-full text-xs ${
                          row?.[column.key] ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}
                      >
                        {row?.[column.key] ? "Active" : "Inactive"}
                      </span>
                    )}
                    {column.type === "Date" && (formatDateAsNumber(row?.[column.key]) ?? "N/A")}
                    {column.type === "Product" && (row?.[column.key][column?.subKey] ?? "N/A")}
                    {column.type === "" &&
                      (row?.[column.key] !== undefined && row?.[column.key] !== null
                        ? row[column.key] ?? "N/A"
                        : "N/A")}
                  </td>
                ))}
                <td className="px-4 py-2 sticky right-0 bg-white z-10">
                  <div className="flex gap-2">
                    {actions?.map((action, index) =>
                      action?.readOnly || action?.hideCondition
                        ?  (
                            <div key={index}>
                              <button
                                onClick={() => action.onClick(row)}
                                className="text-gray-600 hover:text-blue-600"
                                title={action.tooltip}
                              >
                                {action.icon(row)}
                              </button>
                            </div>
                          )
                        : null
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            // Display message when no data is available
            <tr>
              <td
                colSpan={tableData?.columns?.length + (isSelectVisible ? 2 : 1)}
                className="px-4 py-2 text-center text-gray-500 italic"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RawTable;
