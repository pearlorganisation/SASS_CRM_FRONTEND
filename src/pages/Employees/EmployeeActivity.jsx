import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserActivity } from "../../features/actions/userActivity";
import Pagination from "@mui/material/Pagination";

const EmployeeActivity = () => {
  const dispatch = useDispatch();
  const { id, username, role } = useParams();
  const { userActivities } = useSelector((state) => state.userActivity);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getUserActivity({ id, page }));
  }, [id, page]);

  const handlePagination = (e, p) => {
    setPage(p);
    setSearchParams({ page: p });
  };

  return (
    <div className="px-4 md:px-8 py-10">
      {/* Employee Header */}
      <h3 className="text-gray-800 text-2xl font-bold mb-10">
        Activity Details for {username} ({role})
      </h3>

      {/* Activity Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">
                Action
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">
                Details
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">
                Date Time
              </th>
              {/* <th className="text-left py-3 px-4 font-semibold text-gray-600">Updated At</th> */}
            </tr>
          </thead>
          <tbody>
            {userActivities?.data?.length > 0 ? (
              userActivities?.data?.map((activity, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{activity.action}</td>
                  <td className="py-2 px-4">{activity.details}</td>
                  <td className="py-2 px-4 text-nowrap">
                    {new Date(activity.createdAt).toLocaleDateString()}{" "}
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </td>
                  {/* <td className="py-2 px-4">
                    {new Date(activity.updatedAt).toLocaleDateString()}{" "}
                    {new Date(activity.updatedAt).toLocaleTimeString()}
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-4 px-4 text-center text-gray-500" colSpan="4">
                  No activity logs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-5">
        <Pagination
          count={userActivities?.pagination?.totalPages || 1}
          page={Number(page)}
          color="primary"
          onChange={handlePagination}
        />
      </div>
    </div>
  );
};

export default EmployeeActivity;
