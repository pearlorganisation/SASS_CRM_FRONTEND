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
  Skeleton, // Import Skeleton
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const tableCellStyles = {
  paddingTop: "6px",
  paddingBottom: "6px",
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
  } = props;
  const dispatch = useDispatch();

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const isRowSelected = (id) => {
    return selectedRows.includes(id);
  };

  return (
    <TableContainer component={Paper} className="shadow-md">
      <Table>
        <TableHead className="bg-gray-100">
          <TableRow>
            <TableCell className="">S.No</TableCell>
            {isSelectVisible && <TableCell className="">Select</TableCell>}
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
          {isLoading
            ? // Display skeletons while loading
              Array.from({ length: limit <= 10 ? limit : 10 }).map(
                (_, index) => (
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
                )
              )
            : // Display actual data when not loading
              tableData?.rows?.map((row, index) => (
                <TableRow
                  key={row?._id}
                  className={`${
                    isRowSelected(row?._id) ? "bg-blue-50" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  {/* Serial Number */}
                  <TableCell sx={tableCellStyles}>
                    {(page - 1) * limit + index + 1}
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
                    <TableCell key={index} sx={tableCellStyles}>
                      {column.type === "status" && (
                        <Chip
                          label={row?.[column.key] ? "Active" : "Inactive"}
                          color={row?.[column.key] ? "success" : "error"}
                        />
                      )}
                      {column.type === "Date" &&
                        (formatDateAsNumber(row?.[column.key]) ?? "N/A")}
                      {column.type === "" && (row?.[column.key] ?? "N/A")}
                    </TableCell>
                  ))}
                  <TableCell
                    className="sticky right-0 bg-white z-10"
                    sx={{ ...tableCellStyles, borderLeft: "1px solid #ccc" }}
                  >
                    <div className="flex gap-2">
                      {actions?.map((action, index) => (
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
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RawTable;
