import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllClients, updateClient } from "../../features/actions/client";
import {
  Skeleton,
  Stack,
  Button,
  Tooltip,
  IconButton,
  Pagination,
  Grid,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatDateAsNumber } from "../../utils/extra";
import ClientCard from "../../components/Client/ClientCard";
import UpdateClientModal from "../../components/Client/UpdateClientModal";
import { getRoleNameByID } from "../../utils/roles";
import ActiveInactiveModal from "../../components/Client/ActiveInactiveModal";
import {openModal} from '../../features/slices/modalSlice';
import ExportClientExcelModal from "../../components/Export/ExportClientExcelModal";

const Clients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    clientsData = [],
    isLoading,
    totalPages,
    isSuccess,
  } = useSelector((state) => state.client);
  const [activeData, setActiveData] = useState(null);
  const [updateData, setUpdateData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const LIMIT = 10;
  const [page, setPage] = useState(searchParams.get("page") || 1);

  useEffect(() => {
    dispatch(getAllClients({ page: page, limit: LIMIT }));
  }, [page]);

  useEffect(() => {
    if (isSuccess) {
      console.log("issicces ---> called");
      dispatch(getAllClients({ page: page, limit: LIMIT }));
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

  const handleEditClient = (client) => {
    console.log(client);
    setUpdateData(client);
  };

  const handleToggleClientStatus = (client, status) => {
    console.log(`Delete/Inactivate Client : ${client}- ${status}`);
    setActiveData(client);
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
          <IconButton color="primary" onClick={() => handleEditClient(item)}>
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip
          title={item.isActive ? "Set as Inactive" : "Set as Active"}
          arrow
        >
          <IconButton
            color={item.isActive ? "error" : "success"}
            onClick={() => handleToggleClientStatus(item, !item?.isActive)}
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
  const exportExcelModal = "ExportClientExcel";

  return (
    <div className="py-10 md:px-10 sm:pl-4 mt-10">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <div className="flex gap-5">
          <Button variant="contained" color="primary" onClick={handleAddClient}>
            Add Client
          </Button>

          <Button
          
          onClick={() => dispatch(openModal(exportExcelModal))}
          variant="outlined" color="primary">
            Export
          </Button>
        </div>
      </div>

      <div className=" gap-4 md:hidden grid  grid-cols-1">
        {clientsData.map((item, idx) => (
          <ClientCard key={idx} icons={<IconRow item={item} />} item={item} />
        ))}
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
                    <td className="px-6 py-4">{item?.plan?.name || "N/A"}</td>
                    <td className="px-6 py-4">
                      {Array.isArray(item?.subscription) &&
                      item?.subscription.length > 0
                        ? formatDateAsNumber(item?.subscription[0]?.startDate)
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {formatDateAsNumber(item?.currentPlanExpiry)}
                    </td>
                    <td className="px-6 py-4">
                      {Array.isArray(item?.subscription) &&
                      item?.subscription.length > 0
                        ? item?.subscription[0]?.contactLimit
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">{item?.phone || "N/A"}</td>
                    <td className="px-6 py-4">
                      {item?.employees?.length || 0}
                    </td>
                    <td className="px-6 py-4">
                      {Array.isArray(item?.employees)
                        ? item.employees.filter(
                            (emp, idx) =>
                              getRoleNameByID(emp?.role) === "EMPLOYEE SALES"
                          ).length
                        : 0}
                    </td>
                    <td className="px-6 py-4">
                      {Array.isArray(item?.employees)
                        ? item.employees.filter(
                            (emp, idx) =>
                              getRoleNameByID(emp?.role) === "EMPLOYEE REMINDER"
                          ).length
                        : 0}
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
      <UpdateClientModal
        open={updateData ? true : false}
        defaultUserInfo={updateData}
        onClose={() => setUpdateData(null)}
      />

      {activeData && (
        <ActiveInactiveModal clientData={activeData} setModal={setActiveData} />
      )}
      <ExportClientExcelModal modalName={exportExcelModal}/>
    </div>
  );
};

export default Clients;
