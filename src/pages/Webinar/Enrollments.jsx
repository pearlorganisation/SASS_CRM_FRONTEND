import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { enrollmentsColumn } from "../../utils/columnData";
import DataTable from "../../components/Table/DataTable";
import { Visibility } from "@mui/icons-material";
import { getWebinarEnrollments } from "../../features/actions/attendees";

const Enrollments = (props) => {
  const tableHeader = "Enrollments";

  const { id } = useParams();
  const { tabValue, page, setPage } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { webinarEnrollments, totalPages, isLoading, isSuccess } = useSelector(
    (state) => state.attendee
  );
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);

  useEffect(() => {
    dispatch(
      getWebinarEnrollments({
        id: id,
        page: 1,
        limit: LIMIT,
      })
    );
  }, [LIMIT, page, tabValue]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        getWebinarEnrollments({
          id: id,
          page: 1,
          limit: LIMIT,
        })
      );
    }
  }, [isSuccess]);

  const actionIcons = [
    {
      icon: () => (
        <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
      ),
      tooltip: "View Attendee Info",
      onClick: (item) => {
        navigate(
          `/particularContact?email=${item?.attendee}&attendeeId=${item?.attendeeId}`
        );
      },
      readOnly: true,
    },
  ];

  return (
    <>
      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="enrollmentsTable"
        // isSelectVisible={true}
        // setSelectedRows={setSelectedRows}
        // selectedRows={selectedRows}
        tableData={{
          columns: enrollmentsColumn.map((column) => {
            return column;
          }),
          rows: webinarEnrollments,
        }}
        actions={actionIcons}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        limit={LIMIT}
        isLoading={isLoading}
      />
    </>
  );
};

export default Enrollments;
