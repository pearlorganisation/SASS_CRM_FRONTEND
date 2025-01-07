import React from "react";
import { formatDateAsNumber } from "../../utils/extra";
import { useSelector } from "react-redux";

const RawTable = ({
  tableData,
  actions,
  isSelectVisible,
  page,
  limit,
  isLoading,
  selectedRows,
  setSelectedRows,
  rowClick = (row) => console.log("Row clicked:", row),
  isRowClickable = false,
  isLeadType = false,
  userData,
}) => {
  const { isTablesMasked } = useSelector((state) => state.table);

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const isRowSelected = (id) => selectedRows.includes(id);
  const areAllSelected = selectedRows.length === tableData?.rows?.length;

  const handleSelectAllChange = (checked) => {
    setSelectedRows(checked ? tableData?.rows?.map((row) => row._id) : []);
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr className="">
            <th className=" py-6 font-normal text-sm whitespace-nowrap">
              S.No
            </th>
            {isSelectVisible && (
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={areAllSelected}
                  onChange={(e) => handleSelectAllChange(e.target.checked)}
                />
              </th>
            )}
            {tableData?.columns?.map((column, index) => (
              <th
                key={index}
                className="text-start px-4 text-sm font-normal py-3 whitespace-nowrap"
              >
                {column.header}
              </th>
            ))}
            <th className="px-4 py-3 text-gray-700 font-normal  text-sm sticky right-0 bg-gray-100 z-10">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: limit <= 10 ? limit : 10 }).map((_, index) => (
              <tr className="border" key={index}>
                <td className=" flex justify-center px-4 py-4">
                  <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
                </td>
                {tableData?.columns?.map((_, index) => (
                  <td key={index} className="px-4 py-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                ))}
                <td className="px-4 py-2">
                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
                </td>
              </tr>
            ))
          ) : tableData?.rows?.length > 0 ? (
            tableData?.rows?.map((row, index) => (
              <tr
                key={row?._id}
                className={`${
                  isRowSelected(row?._id) ? "bg-blue-50" : "bg-white"
                } hover:bg-gray-50 border-b whitespace-nowrap`}
              >
                <td
                  className={`px-4 py-2 text-gray-600 ${
                    isRowClickable ? "cursor-pointer" : ""
                  }`}
                  onClick={() => rowClick(row)}
                >
                  <div
                    className={`flex items-center justify-between ${
                      !isLeadType ? "px-3" : ""
                    }`}
                  >
                    {isLeadType && (
                      <div
                        className="w-2 h-full rounded"
                        style={{
                          backgroundColor:
                            row?.leadType?.color || "transparent",
                        }}
                      ></div>
                    )}
                    {(page - 1) * limit + index + 1}
                  </div>
                </td>
                {isSelectVisible && (
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
                      checked={isRowSelected(row?._id)}
                      onChange={() => handleCheckboxChange(row?._id)}
                    />
                  </td>
                )}
                {tableData?.columns?.map((column, index) => (
                  <td
                    key={index}
                    className={`px-4 py-2 text-gray-600 ${
                      isRowClickable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => rowClick(row)}
                  >
                    {column.type === "status" && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          row?.[column.key]
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {row?.[column.key] ? "Active" : "Inactive"}
                      </span>
                    )}
                    {column.type === "Date" &&
                      (formatDateAsNumber(row?.[column.key]) ?? "N/A")}
                    {column.type === "Product" &&
                      (row?.[column.key][column?.subKey] ?? "N/A")}
                    {column.type === "" &&
                      (row?.[column.key] !== undefined &&
                      row?.[column.key] !== null
                        ? isTablesMasked &&
                          [
                            "userName",
                            "email",
                            "phone",
                            "firstName",
                            "lastName",
                          ].includes(column.key)
                          ? `${row[column.key].slice(0, 3)}***`
                          : row[column.key] ?? "N/A"
                        : "N/A")}
                  </td>
                ))}
                <td className="px-4 py-2 sticky right-0 bg-white z-10 border-l">
                  <div className="flex gap-2">
                    {actions?.map((action, index) =>
                      (action?.readOnly || userData?.isActive,
                      action?.hideCondition
                        ? action.hideCondition(row)
                        : true) ? (
                        <div key={index}>
                          <button
                            className="p-2 hover:bg-gray-100 rounded-full group"
                            onClick={() => action.onClick(row)}
                            title={action.tooltip}
                          >
                            {action.icon(row)}
                          </button>
                        </div>
                      ) : null
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tableData?.columns?.length + (isSelectVisible ? 2 : 1)}
                className="px-4 py-8 text-center text-gray-500 italic"
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
