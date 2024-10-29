import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAttendees } from "../../features/actions/webinarContact";
import Pagination from "@mui/material/Pagination";
import { Skeleton, Stack } from "@mui/material";
import AssignmentTable from "../../components/AssignmentTable";

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
        <AssignmentTable
          assignmentData={attendeeData?.result}
          isLoading={isLoading}
          page={page}
          LIMIT={10}
        />

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
