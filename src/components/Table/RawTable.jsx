import { useState } from "react";
import { formatDateAsNumber } from "../../utils/extra";
import {
  Checkbox,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import ComponentGuard from "../AccessControl/ComponentGuard";

const tableCellStyles = {
  paddingTop: "6px",
  paddingBottom: "6px",
  height: "50px",
  textWrap: "nowrap",
  color: "#555A68",
};

const thStyles = " whitespace-nowrap";

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
      console.log("Row clicked:", row);
    },
    isRowClickable = false,
    isLeadType = false,
    userData,
  } = props;
  const dispatch = useDispatch();
  const { isTablesMasked } = useSelector((state) => state.table);

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
    <TableContainer component={Paper} className="shadow-md">
      <Table>
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="">S.No</TableCell>
            {isSelectVisible && (
              <TableCell className="">
                <Checkbox
                  color="primary"
                  checked={areAllSelected}
                  indeterminate={
                    selectedRows.length > 0 &&
                    selectedRows.length < tableData?.rows?.length
                  }
                  onChange={(e) => handleSelectAllChange(e.target.checked)}
                />
              </TableCell>
            )}
            {tableData?.columns?.map((column, index) => (
              <TableCell key={index} className={thStyles}>
                {column.header}
              </TableCell>
            ))}
            <TableCell className="font-semibold text-gray-700 sticky right-0 bg-gray-100 z-10">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            // Display skeletons while loading
            Array.from({ length: limit <= 10 ? limit : 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell sx={tableCellStyles}>
                  <Skeleton variant="text" width="100%" />
                </TableCell>
                {isSelectVisible && (
                  <TableCell sx={tableCellStyles}>
                    <Checkbox color="primary" disabled />
                  </TableCell>
                )}
                {tableData?.columns?.map((column, index) => (
                  <TableCell key={index} sx={tableCellStyles}>
                    <Skeleton variant="text" width="100%" />
                  </TableCell>
                ))}
                <TableCell sx={tableCellStyles}>
                  <Skeleton variant="circle" width={30} height={30} />
                </TableCell>
              </TableRow>
            ))
          ) : tableData?.rows?.length > 0 ? (
            // Display actual data when not loading and rows are available
            tableData?.rows?.map((row, index) => (
              <TableRow
                key={row?._id}
                className={`${
                  isRowSelected(row?._id) ? "bg-blue-50" : "bg-white"
                } hover:bg-gray-50`}
              >
                <TableCell
                  className={`${isRowClickable ? "cursor-pointer" : ""}`}
                  onClick={() => rowClick(row)}
                  sx={{
                    paddingTop: "0px",
                    paddingBottom: "0px",
                    height: "30px",
                    textWrap: "nowrap",
                    color: "#555A68",
                  }}
                >
                  <div className={`flex h-full items-center justify-between ${!isLeadType ? 'px-3' : ''}`}>
                    {isLeadType && (
                      <div
                        className="w-2 h-full"
                        style={{
                          backgroundColor:
                            row?.leadType?.color || "transparent",
                          borderRadius: "5%",
                        }}
                      ></div>
                    )}

                    {(page - 1) * limit + index + 1}
                  </div>
                </TableCell>
                {isSelectVisible && (
                  <TableCell sx={tableCellStyles}>
                    <Checkbox
                      color="primary"
                      checked={isRowSelected(row?._id)}
                      onChange={() => handleCheckboxChange(row?._id)}
                    />
                  </TableCell>
                )}
                {tableData?.columns?.map((column, index) => (
                  <TableCell
                    className={`${isRowClickable ? "cursor-pointer" : ""}`}
                    onClick={() => rowClick(row)}
                    key={index}
                    sx={tableCellStyles}
                  >
                    {column.type === "status" && (
                      <Chip
                        label={row?.[column.key] ? "Active" : "Inactive"}
                        color={row?.[column.key] ? "success" : "error"}
                      />
                    )}
                    {column.type === "Date" &&
                      (formatDateAsNumber(row?.[column.key]) ?? "N/A")}

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
                  </TableCell>
                ))}
                <TableCell
                  className="sticky right-0 bg-white z-10"
                  sx={{ ...tableCellStyles, borderLeft: "1px solid #ccc" }}
                >
                  <div className="flex gap-2">
                    {actions?.map((action, index) => (
                      <ComponentGuard
                        key={index}
                        conditions={[
                          action?.readOnly || userData?.isActive,
                          action?.hideCondition
                            ? action.hideCondition(row)
                            : true,
                        ]}
                      >
                        <div key={index}>
                          <Tooltip title={action.tooltip} arrow>
                            <IconButton
                              className="group"
                              onClick={() => action.onClick(row)}
                            >
                              {action.icon(row)}
                            </IconButton>
                          </Tooltip>
                        </div>
                      </ComponentGuard>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // Display message when no data is available
            <TableRow>
              <TableCell
                colSpan={tableData?.columns?.length + (isSelectVisible ? 2 : 1)}
                align="center"
                sx={{ color: "#999", fontStyle: "italic", padding: "20px" }}
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RawTable;
