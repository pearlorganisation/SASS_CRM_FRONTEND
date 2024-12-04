import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Pagination } from "@mui/material";
import { getAttendees } from "../../features/actions/attendees";

const tableCellStyles = {
  paddingTop: "6px",
  paddingBottom: "6px",
  textWrap: "nowrap",
};

const TableWithStickyActions = ({page, setPage}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const { attendeeData, isLoading, isSuccess, totalPages } = useSelector(
    (state) => state.attendee
  );

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const isRowSelected = (id) => selectedRows.includes(id);

  const handleEdit = (id) => {
    console.log(`Editing row with id: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Deleting row with id: ${id}`);
  };

  const handleView = (id) => {
    console.log(`Viewing details for row with id: ${id}`);
  };
  const thStyles = "font-semibold  text-gray-700 whitespace-nowrap";

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Attendee Table</h2>
      <TableContainer component={Paper} className="shadow-md">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="">Select</TableCell>
              <TableCell className={thStyles}>Email</TableCell>
              <TableCell className={thStyles}>First Name</TableCell>
              <TableCell className={thStyles}>Last Name</TableCell>
              <TableCell className={thStyles}>Time in Session</TableCell>
              <TableCell className={thStyles}>Gender</TableCell>
              <TableCell className={thStyles}>Location</TableCell>
              <TableCell className={thStyles}>Mobile No</TableCell>
              <TableCell className="font-semibold text-gray-700 sticky right-0 bg-gray-100 z-10">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendeeData.map((row) => (
              <TableRow
                key={row?._id}
                className={`${
                  isRowSelected(row?._id) ? "bg-blue-50" : "bg-white"
                } hover:bg-gray-50`}
              >
                <TableCell sx={tableCellStyles}>
                  <Checkbox
                    color="primary"
                    checked={isRowSelected(row?._id)}
                    onChange={() => handleCheckboxChange(row?._id)}
                  />
                </TableCell>
                <TableCell sx={tableCellStyles}>{row?.email ?? "N/A"}</TableCell>
                <TableCell sx={tableCellStyles}>{row?.firstName ?? "N/A"}</TableCell>
                <TableCell sx={tableCellStyles}>{row?.lastName ?? "N/A"}</TableCell>
                <TableCell sx={tableCellStyles}>{row?.timeInSession ?? "N/A"}</TableCell>
                <TableCell sx={tableCellStyles}>{row?.gender ?? "N/A"}</TableCell>
                <TableCell sx={tableCellStyles}>{row?.location ?? "N/A"}</TableCell>
                <TableCell sx={tableCellStyles}>{row?.phone ?? "N/A"}</TableCell>
                <TableCell
                  className="sticky right-0 bg-white z-10"
                  sx={tableCellStyles}
                >
                  <div className="flex gap-2 ">
                    <IconButton onClick={() => handleView(row?.id)}>
                      <VisibilityIcon className="text-gray-600" />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(row?.id)}>
                      <EditIcon className="text-blue-600" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row?.id)}>
                      <DeleteIcon className="text-red-600" />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center mt-5">
        <Pagination
          count={totalPages}
          page={Number(page)}
          color="primary"
          onChange={(_, page) => setPage(page)}
        />
      </div>
    </div>
  );
};

export default TableWithStickyActions;
