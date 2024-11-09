import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllAssignments } from "../../features/actions/webinarContact";
import { Pagination, Skeleton, Stack } from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import AssignmentTable from "../../components/AssignmentTable";

const Assignments = () => {
  const dispatch = useDispatch();
  const { isLoading, assignmentData, totalPages } = useSelector(
    (state) => state.webinarContact
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const LIMIT = 10;
  const [page, setPage] = useState( searchParams.get("page") || 1);

  useEffect(() => {
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

      <AssignmentTable
        isLoading={isLoading}
        assignmentData={assignmentData}
        page={page}
        LIMIT={LIMIT}
      />


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