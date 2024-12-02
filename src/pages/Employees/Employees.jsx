import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Stack,
  Button,
} from "@mui/material";
import { Edit, Visibility, ToggleOn, ToggleOff } from "@mui/icons-material";
import {
  changeEmployeeStatus,
  getAllEmployees,
} from "../../features/actions/employee";
import ConfirmActionModal from "./modal/ConfirmActionModal";
import { getRoleNameByID } from "../../utils/roles";

const tableCellStyles = {
  paddingTop: "8px",
  paddingBottom: "8px",
  textWrap: "nowrap",
};

const Employees = () => {
  const [statusModalData, setStatusModalData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employeeData, isLoading } = useSelector((state) => state.employee);
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllEmployees(userData?.id));
  }, [userData]);

  const handleStatusChange = (item) => {
    setStatusModalData(item);
  };

  const navigateToAdd = () => navigate("/createEmployee");

  return (
    <>
      <div className="p-10">
        <h1 className="text-2xl font-bold text-gray-700">
          Manage Employee Details
        </h1>
        {/* Add Employee Button */}
        <div className="flex justify-end items-center pb-4">
          <Button variant="contained" onClick={navigateToAdd}>
            Add Employee
          </Button>
        </div>

        {/* Employee Table */}
        <TableContainer component={Paper} className="shadow-md rounded-lg">
          <Table stickyHeader>
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-semibold text-gray-700  whitespace-nowrap">
                  Username / Email
                </TableCell>
                <TableCell className="font-semibold text-gray-700  whitespace-nowrap">
                  Phone Number
                </TableCell>
                <TableCell className="font-semibold text-gray-700  whitespace-nowrap">
                  Role
                </TableCell>
                <TableCell className="font-semibold text-gray-700  whitespace-nowrap">
                  Status
                </TableCell>
                <TableCell className="font-semibold text-gray-700  whitespace-nowrap">
                  Valid Call Time
                </TableCell>
                <TableCell className="font-semibold text-gray-700  whitespace-nowrap">
                  Daily Contact Limit
                </TableCell>
                <TableCell className="font-semibold text-gray-700  whitespace-nowrap sticky right-0 z-10">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Stack spacing={4}>
                      <Skeleton variant="rounded" height={30} />
                      <Skeleton variant="rounded" height={25} />
                      <Skeleton variant="rounded" height={20} />
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                employeeData.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50">
                    <TableCell sx={tableCellStyles}>
                      <div>
                        <div className="font-semibold">{item?.userName}</div>
                        <div className="text-sm text-gray-500">
                          {item?.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={tableCellStyles}>{item?.phone}</TableCell>
                    <TableCell sx={tableCellStyles}>
                      {getRoleNameByID(item?.role)}
                    </TableCell>
                    <TableCell sx={tableCellStyles}>
                      {item?.isActive ? "Active" : "Inactive"}
                    </TableCell>
                    <TableCell sx={tableCellStyles}>20 sec</TableCell>
                    <TableCell sx={tableCellStyles}>100 Contacts</TableCell>
                    <TableCell
                      sx={tableCellStyles}
                      className="sticky right-0 bg-white z-10"
                    >
                      <div className="flex gap-2">
                        <Tooltip title="View Details">
                          <IconButton
                            onClick={() =>
                              navigate(`/employees/assignments/${item?._id}`)
                            }
                            sx={{ color: "blue" }} // Material-UI color styling
                          >
                            <Visibility className="text-blue-600" />{" "}
                            {/* Tailwind class */}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Activity">
                          <IconButton
                            onClick={() =>
                              navigate(
                                `/employees/Activity/${item?._id}/${item?.userName}/${item?.role?.name}`
                              )
                            }
                            sx={{ color: "green" }} // Material-UI color styling
                          >
                            <Edit className="text-green-600" />{" "}
                            {/* Tailwind class */}
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={item?.isActive ? "Deactivate" : "Activate"}
                        >
                          <IconButton
                            onClick={() => handleStatusChange(item)}
                            sx={{ color: item?.isActive ? "red" : "green" }} // Material-UI dynamic color styling
                          >
                            {item?.isActive ? (
                              <ToggleOff  fontSize="large" className="text-red-600" /> // Tailwind class
                            ) : (
                              <ToggleOn fontSize="large"  className="text-green-600" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Confirm Action Modal */}
      {statusModalData && (
        <ConfirmActionModal
          setModal={setStatusModalData}
          handleAction={() => {
            dispatch(changeEmployeeStatus(statusModalData?._id));
            setStatusModalData(null);
          }}
          modalData={statusModalData}
          action={statusModalData?.isActive ? "deactivate" : "activate"}
        />
      )}
    </>
  );
};

export default Employees;
