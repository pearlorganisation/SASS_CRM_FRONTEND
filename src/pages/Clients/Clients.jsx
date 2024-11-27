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
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { formatDateAsNumber } from "../../utils/extra";
import ClientCard from "../../components/Client/ClientCard";
import UpdateClientModal from "../../components/Client/UpdateClientModal";

const Clients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clientsData=[], isLoading, totalPages } = useSelector((state) => state.client);
  const { userData } = useSelector((state) => state.auth);

  const [updateData, setUpdateData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const LIMIT = 10;
  const [page, setPage] = useState(searchParams.get("page") || 1);

  useEffect(() => {
    dispatch(getAllClients({ page: page, limit: LIMIT }));
  }, [page]);

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  const handlePagination = (_, page) => {
    setPage(page);
  };

  const handleAddClient = () => {
    navigate("/add-client"); // Replace with your actual add-client route
  };

  const handleEditClient = (client) => {
    setUpdateData(client);
  };

  const handleDeleteClient = (clientId) => {
    console.log(`Delete/Inactivate Client ID: ${clientId}`);
  };

  const handleViewClient = (clientId) => {
    navigate(`/view-client/${clientId}`);
  };

  return (
    <div className="p-10 mt-10">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddClient}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Client
        </Button>
      </div>
      
      <div className="block sm:hidden">
      {clientsData.map((item, idx) => (
          <ClientCard
            key={idx}
            item={item}
            handleEditClient={handleEditClient}
            handleDeleteClient={handleDeleteClient}
            handleViewClient={handleViewClient}
          />
        ))}
      </div>

      {/* Clients Table */}
      <div className="relative hidden sm:block  overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr className="stickyRow">
              <th scope="col" className="px-6 py-3 text-nowrap">
                Username / Email
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
              <th className="py-3 text-nowrap px-6 stickyFieldRight">Action</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="text-center px-6 py-8">
                  <Stack spacing={4}>
                    <Skeleton variant="rounded" height={30} />
                    <Skeleton variant="rounded" height={25} />
                    <Skeleton variant="rounded" height={20} />
                  </Stack>
                </td>
              </tr>
            ) : (
              Array.isArray(clientsData) &&
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
                  <td className="px-6 py-4">
                    {item?.isActive ? "Active" : "Inactive"}
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
                  <td className="px-6 py-4">{item?.phone}</td>
                  <td className="px-3   whitespace-nowrap stickyFieldRight">
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
                        onClick={() => handleEditClient(item)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    {/* Delete/Inactive Icon */}
                    <Tooltip title="Inactivate/Delete Client" arrow>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClient(item?._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
        open={updateData ? true: false}
        email={updateData?.email}
        userName={updateData?.userName}
        phone={updateData?.phone}
        _id={updateData?._id}
        onClose={() => setUpdateData(null)}
        onUpdate={(data) => console.log(data)}
      />
    </div>
  );
};

export default Clients;
