import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "../../features/actions/employee";
import { Skeleton, Stack, Button } from "@mui/material";
import { getRoleNameByID, roles } from "../../utils/roles";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";

const Clients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clientsData, isLoading } = useSelector((state) => state.employee);
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllClients());
  }, [dispatch]);

  const handleAddClient = () => {
    navigate("/add-client"); // Replace with your actual add-client route
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

      {/* Clients Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Username / Email
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3">
                Role
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center px-6 py-8">
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
                  <td className="px-6 py-4">{item?.phone}</td>
                  <td className="px-6 py-4">{getRoleNameByID(item?.role)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
