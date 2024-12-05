import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Box, TextField, Grid, Tabs, Tab } from "@mui/material";
import TableWithStickyActions from "../Test/TableWithStickyActions"; // Assuming this is your table component
// import UpdateCsvXslxModal from "./UpdateCsvXslxModal";
import { clearSuccess, setTabValue } from "../../features/slices/attendees";
import { getAttendees } from "../../features/actions/attendees";

const WebinarAttendees = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { tabValue, isSuccess } = useSelector((state) => state.attendee);
  const [showModal, setShowModal] = useState(false);

  const LIMIT = 10;
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  useEffect(() => {
    dispatch(getAttendees({ page, limit: LIMIT }));
  }, [page]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        getAttendees({ id, isAttended: tabValue, page: 1, limit: LIMIT })
      );
      dispatch(clearSuccess());
    }
  }, [isSuccess]);

  return (
    <div className="px-6 md:px-10 pt-14 space-y-4">
     

      <div className="flex gap-4 justify-end">
        {/* <Button
          onClick={() => setShowModal((prev) => !prev)}
          variant="outlined"
        >
          Import
        </Button> */}
        <Button variant="outlined">Filters</Button>
      </div>

      {/* Table Component */}
      <TableWithStickyActions
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        page={page}
        setPage={setPage}
      />

      {/* {showModal &&
        createPortal(
          <UpdateCsvXslxModal setModal={setShowModal} csvId={id} />,
          document.body
        )} */}
    </div>
  );
};

export default WebinarAttendees;
