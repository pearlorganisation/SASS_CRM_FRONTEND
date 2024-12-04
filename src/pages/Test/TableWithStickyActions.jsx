import React, { useState } from "react";
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

// Dummy Data
const dummyData = [
  { id: 1, name: "John Doe", email: "johndoe@example.com", gender: "Male", city: "New York", product: "Laptop", mobile: "123-456-7890" },
  { id: 2, name: "Jane Smith", email: "janesmith@example.com", gender: "Female", city: "Los Angeles", product: "Smartphone", mobile: "987-654-3210" },
  { id: 3, name: "Alice Johnson", email: "alicej@example.com", gender: "Female", city: "Chicago", product: "Tablet", mobile: "555-123-4567" },
  { id: 4, name: "Bob Brown", email: "bobbrown@example.com", gender: "Male", city: "Houston", product: "Camera", mobile: "666-789-1234" },
];

const tableCellStyles = {
    paddingTop: '6px',
    paddingBottom:'6px',
    textWrap: 'nowrap'
}

const TableWithStickyActions = () => {
  const {attendeeData , isLoading, isSuccess } = useSelector(state => state.attendee);
  console.log(" ----- > ",attendeeData)

  const [selectedRows, setSelectedRows] = useState([]);

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

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Attendee Table</h2>
      <TableContainer component={Paper} className="shadow-md">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold text-gray-700">Select</TableCell>
              <TableCell className="font-semibold text-gray-700">Email</TableCell>
              <TableCell className="font-semibold text-gray-700">First Name</TableCell>
              <TableCell className="font-semibold text-gray-700">Last Name</TableCell>

              <TableCell className="font-semibold text-gray-700">Gender</TableCell>
              <TableCell className="font-semibold text-gray-700">City</TableCell>
              <TableCell className="font-semibold text-gray-700">Product</TableCell>
              <TableCell className="font-semibold text-gray-700">Mobile No</TableCell>
              <TableCell
                className="font-semibold text-gray-700 sticky right-0 bg-gray-100 z-10"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row) => (
              <TableRow
                key={row.id}
                className={`${
                  isRowSelected(row.id) ? "bg-blue-50" : "bg-white"
                } hover:bg-gray-50`}
              >
                <TableCell sx={tableCellStyles}>
                  <Checkbox
                    color="primary"
                    checked={isRowSelected(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                  />
                </TableCell>
                <TableCell sx={tableCellStyles}>{row.name}</TableCell>
                <TableCell sx={tableCellStyles}>{row.email}</TableCell>
                <TableCell sx={tableCellStyles}>{row.gender}</TableCell>
                <TableCell sx={tableCellStyles}>{row.city}</TableCell>
                <TableCell sx={tableCellStyles}>{row.product}</TableCell>
                <TableCell sx={tableCellStyles}>{row.mobile}</TableCell>
                <TableCell
                  className="sticky right-0 bg-white z-10"
                  sx={tableCellStyles}
                >
                  <div className="flex gap-2 ">
                    <IconButton onClick={() => handleView(row.id)}>
                      <VisibilityIcon className="text-gray-600" />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(row.id)}>
                      <EditIcon className="text-blue-600" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <DeleteIcon className="text-red-600" />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="mt-4">
        <p>
          <strong>Selected Rows:</strong>{" "}
          {selectedRows.length > 0
            ? selectedRows.join(", ")
            : "No rows selected"}
        </p>
      </div>
    </div>
  );
};

export default TableWithStickyActions;
