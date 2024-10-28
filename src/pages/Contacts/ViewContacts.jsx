import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAttendees } from "../../features/actions/webinarContact";
import Pagination from "@mui/material/Pagination";
import { Skeleton, Stack } from "@mui/material";

const ViewContacts = () => {
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const { csvId } = useParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { attendeeData, isLoading } = useSelector(
    (state) => state.webinarContact
  );

  

  const pageCount = attendeeData?.totalPages;

  const handlePagination = (e, p) => {
    setPage(p);
    setSearchParams({ page: p });
  };

  useEffect(() => {
    dispatch(getAttendees({ page, data: { csvId: csvId } }));
  }, [page]);

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-2 py-10 ">
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
              Manage Attendees Details
            </h3>
            <p className="text-gray-600 text-[15px] font-medium mt-2">
              This page is showing all the Attendees for particular webinar.
            </p>
          </div>
        </div>
        <div className="mt-12 shadow-lg rounded-lg overflow-x-auto">
          {attendeeData?.result?.length <= 0 ? (
            <div className="text-lg p-2 flex justify-center w-full">
              No record found
            </div>
          ) : (
            <table className="w-full table-auto text-sm text-left ">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b justify-between">
                <tr>
                  <th className="py-3 px-2 ">S No.</th>
                  <th className="py-3 px-2 ">Email</th>
                  <th className="py-3 px-2 ">First Name</th>
                  <th className="py-3 px-2 ">Last Name</th>
                  <th className="py-3 px-2 text-center">Webinar Minutes</th>
                  <th className="py-3 px-2 text-center ">Total Records</th>

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
                ) : (
                  Array.isArray(attendeeData?.result) &&
                  attendeeData?.result?.length > 0 &&
                  attendeeData?.result?.map((item, idx) => {
                    const serialNumber = (page - 1) * 25 + idx + 1;
              
                    return (
                      <tr>
                        <td
                          className={`px-2 py-4 whitespace-nowrap border-l-8 border-red-500`}
                        >
                          {serialNumber}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item._id}
                        </td>

                        <td className="px-2 py-4 whitespace-nowrap ">
                          {item?.records[0]?.firstName || 'N/A'}
                        </td>
                        <td className="px-2 py-4 whitespace-nowrap">
                          {item?.records[0]?.lastName?.match(/:-\)/)
                            ? "--"
                            : item?.lastName || "N/A"}
                        </td>
                        <td className="px-2  text-center py-4 whitespace-nowrap">
                          {item?.records?.reduce((acc,time)=>
                            acc + time?.timeInSession
                          ,0)}
                        </td>
                        <td className="px-2 text-center  py-4 whitespace-nowrap">
                          {item?.records?.length}
                        </td>

                        <td className="px-2 whitespace-nowrap">
                          <Link to={"/particularContact"} state={item}
                            className="cursor-pointer py-2 px-3 font-semibold text-indigo-500 hover:text-indigo-600 duration-150 hover:bg-gray-50 rounded-lg
                    "
                          >
                            View full details
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className="flex justify-center mt-5">
        <Pagination
          count={pageCount}
          page={Number(page)}
          color="primary"
          onChange={handlePagination}
        />
      </div>
    </>
  );
};

export default ViewContacts;
