

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllClients } from "../../features/actions/client";
import {
  Skeleton,
  Stack,
  Button,
  Tooltip,
  IconButton,
  Pagination,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatDateAsNumber } from "../../utils/extra";
import ClientCard from "../../components/Client/ClientCard";
import UpdateClientModal from "../../components/Client/UpdateClientModal";
import ActiveInactiveModal from "../../components/Client/ActiveInactiveModal";
import { openModal } from "../../features/slices/modalSlice";
import ExportClientExcelModal from "../../components/Export/ExportClientExcelModal";
import ClientFilterModal from "../../components/Client/ClientFilterModal";

const Clients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    clientsData = [],
    isLoading,
    totalPages,
    isSuccess,
  } = useSelector((state) => state.client);
  const [searchParams, setSearchParams] = useSearchParams();
  const LIMIT = 10;
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    dispatch(getAllClients({ page: page, limit: LIMIT, filters: filters }));
  }, [page, filters]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(getAllClients({ page: page, limit: LIMIT, filters: filters }));
    }
  }, [isSuccess]);

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  const handlePagination = (_, page) => {
    setPage(page);
  };

  const handleAddClient = () => {
    navigate("/add-client");
  };

  const handleViewClient = (clientId) => {
    navigate(`/view-client/${clientId}`);
  };

  const IconRow = ({ item }) => {
    return (
      <div>
        {/* View Icon */}
        <Tooltip title="View Client Info" arrow>
          <IconButton
            color="primary"
            className=" group"
            onClick={() => handleViewClient(item?._id)}
          >
            <VisibilityIcon className="text-indigo-500 group-hover:text-indigo-600" />
          </IconButton>
        </Tooltip>
        {/* Edit Icon */}
        <Tooltip title="Edit Client" arrow>
          <IconButton
            color="primary"
            onClick={() =>
              dispatch(
                openModal({ modalName: updateClientModalname, data: item })
              )
            }
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip
          title={item.isActive ? "Set as Inactive" : "Set as Active"}
          arrow
        >
          <IconButton
            color={item.isActive ? "error" : "success"}
            onClick={() =>
              dispatch(
                openModal({
                  modalName: updateClientStatusModalName,
                  data: item,
                })
              )
            }
          >
            {
              <div className={`${item?.isActive ? "" : "rotate-180"}`}>
                <LogoutIcon />
              </div>
            }
          </IconButton>
        </Tooltip>
      </div>
    );
  }; 

  const updateClientModalname = "UpdateClientModal";
  const updateClientStatusModalName = "UpdateClientStatusModal";
  const exportExcelModalName = "ExportClientExcel";
  const clientFilterModalName = "ClientFilterModal";
  return (
    <div className="py-10 md:px-10 px-4 sm:pl-4 mt-10">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <div className="flex gap-5">
          <Button variant="contained" color="primary" onClick={handleAddClient}>
            Add Client
          </Button>
          <Button
            onClick={() => dispatch(openModal(clientFilterModalName))}
            variant="outlined"
            color="primary"
          >
            Filter
          </Button>

          <Button
            onClick={() => dispatch(openModal(exportExcelModalName))}
            variant="outlined"
            color="primary"
          >
            Export
          </Button>
        </div>
      </div>

      <div className=" gap-4 md:hidden grid  grid-cols-1">
        {/* {clientsData.map((item, idx) => (
          <ClientCard key={idx} icons={<IconRow item={item} />} item={item} />
        ))} */}
      </div>

      {/* Clients Table */}
      <div className="relative hidden md:block  overflow-x-auto shadow-md sm:rounded-lg">
        {isLoading ? (
          <Stack spacing={4}>
            <Skeleton variant="rounded" height={35} />
            <Skeleton variant="rounded" height={25} />
            <Skeleton variant="rounded" height={25} />
            <Skeleton variant="rounded" height={25} />
            <Skeleton variant="rounded" height={25} />
            <Skeleton variant="rounded" height={25} />
            <Skeleton variant="rounded" height={25} />
            <Skeleton variant="rounded" height={25} />
          </Stack>
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr className="stickyRow">
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Username / Email
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Company Name
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Plan Name
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Plan Start Date
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Plan Expiry
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Contants Limit
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Phone Number
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Toggle Limit
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  Total Employees
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  EMPLOYEE SALES
                </th>
                <th scope="col" className="px-6 py-3 text-nowrap">
                  EMPLOYEE REMINDER
                </th>
                <th className="py-3 text-nowrap px-6 stickyFieldRight">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(clientsData) &&
                clientsData.map((item, idx) => (
                  <tr key={idx} className="bg-white border-b hover:bg-gray-50">
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
                    >
                      <div>
                        <div className="text-base font-semibold">
                          {item?.userName}
                        </div>
                        <div className="font-normal text-gray-500">
                          {item?.email}
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{item?.companyName || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          item?.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item?.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item?.planName || "N/A"}</td>
                    <td className="px-6 py-4">
                      {formatDateAsNumber(item?.planStartDate) || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateAsNumber(item?.planExpiry)}
                    </td>
                    <td className="px-6 py-4">
                      {item?.contactsLimit || "N/A"}
                    </td>
                    <td className="px-6 py-4">{item?.phone || "N/A"}</td>
                    <td className="px-6 py-4">{item?.toggleLimit || 0}</td>
                    <td className="px-6 py-4">{item.totalEmployees || 0}</td>
                    <td className="px-6 py-4">
                      {item.employeeSalesCount || 0}
                    </td>
                    <td className="px-6 py-4">
                      {item.employeeReminderCount || 0}
                    </td>
                    <td className="px-3   whitespace-nowrap stickyFieldRight">
                      <IconRow item={item} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex justify-center mt-5">
        <Pagination
          count={totalPages || 1}
          page={Number(page)}
          color="primary"
          onChange={handlePagination}
        />
      </div>

      <UpdateClientModal modalName={updateClientModalname} />
      <ActiveInactiveModal modalName={updateClientStatusModalName} />
      <ExportClientExcelModal filters={filters} modalName={exportExcelModalName} />
      <ClientFilterModal
        setFilters={setFilters}
        filters={filters}
        modalName={clientFilterModalName}
      />
    </div>
  );
};

export default Clients;
