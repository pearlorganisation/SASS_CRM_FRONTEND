import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllAssignments } from "../../features/actions/webinarContact";
import { Pagination, Skeleton, Stack } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";

const Assignments = () => {
  const dispatch = useDispatch();
  const { isLoading, assignmentData, totalPages } = useSelector(
    (state) => state.webinarContact
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const LIMIT = 10;
  const [page, setPage] = useState( searchParams.get("page") || 1);

  useEffect(() => {
    console.log("useEffect");
    dispatch(getAllAssignments({ page: page, limit: LIMIT }));
  }, [page]);

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  const handlePagination = (_, page) => {
    setPage(page);
  };

  return (
    <div className="px-4 md:px-8 py-10">
      <h3 className="text-gray-800 text-xl font-bold sm:text-2xl mb-5">
        Manage Assignment Details
      </h3>

      <div className="mt-7 shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full table-auto text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b justify-between">
            <tr>
              <th className="py-3 px-6 text-center">S No.</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">First Name</th>
              {/* <th className="py-3 px-6">Last Name</th> */}
              <th className="py-3 text-center px-6">Webinar Minutes</th>
              <th className="py-3 text-center px-6">Record Type</th>
              <th className="py-3 text-center px-6">Total Records</th>
              <th className="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 divide-y">
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center px-6 py-8">
                  <Stack spacing={4}>
                    <Skeleton variant="rounded" height={30} />
                    <Skeleton variant="rounded" height={25} />
                    <Skeleton variant="rounded" height={20} />
                    <Skeleton variant="rounded" height={20} />
                    <Skeleton variant="rounded" height={20} />
                  </Stack>
                </td>
              </tr>
            ) : Array.isArray(assignmentData) && assignmentData.length > 0 ? (
              assignmentData.map((item, index) => {
                const serialNumber = (page - 1) * LIMIT + index + 1;
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {serialNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item?.records[0]?.firstName}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {item?.records?.reduce(
                        (acc, time) => acc + time?.timeInSession,
                        0
                      )}
                    </td>
                    <td className="px-6 py-4 capitalize text-center whitespace-nowrap">
                      {item?.records[0]?.recordType}
                    </td>
                    <td className="px-6 py-4  text-center whitespace-nowrap">
                      {item?.records?.length}
                    </td>
                    <td className="px-3 whitespace-nowrap">
                      <Link
                        to={"/particularContact"}
                        state={item}
                        className="cursor-pointer py-2 px-3 font-semibold text-indigo-500 hover:text-indigo-600 duration-150 hover:bg-gray-50 rounded-lg
                    "
                      >
                        View full details
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <div className="text-gray-700 p-3">No Data Found</div>
            )}
          </tbody>
        </table>
      </div>


      <div className="flex justify-center mt-5">
        <Pagination
          count={totalPages}
          page={Number(page)}
          color="primary"
          onChange={handlePagination}
        />
      </div>
    </div>
  );
};

export default Assignments;
