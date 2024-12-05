import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Box, TextField, Grid, Tabs, Tab } from "@mui/material";
import TableWithStickyActions from "../Test/TableWithStickyActions"; // Assuming this is your table component
import { createPortal } from "react-dom";
import UpdateCsvXslxModal from "./modal/UpdateCsvXslxModal";
import { clearSuccess, setTabValue } from "../../features/slices/attendees";
import { getAttendees } from "../../features/actions/attendees";

const WebinarAttendees = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { tabValue, isSuccess } = useSelector((state) => state.attendee);
  const [showModal, setShowModal] = useState(false);

  const LIMIT = useSelector((state) => state.pageLimits['attendeeTable'] || 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  // Tabs change handler
  const handleTabChange = (_, newValue) => {
    dispatch(setTabValue(newValue));
    setPage(1);
  };

  useEffect(() => {
    dispatch(getAttendees({ id, isAttended: tabValue, page, limit: LIMIT }));
  }, [page, tabValue, LIMIT]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        getAttendees({ id, isAttended: tabValue, page: 1, limit: LIMIT })
      );
      dispatch(clearSuccess());
    }
  }, [isSuccess]);

  return (
    <div className="px-6 md:px-10 pt-10 space-y-6">
      {/* Tabs for Sales and Reminder */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        centered
        className="border-b border-gray-200"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Reminder" value="preWebinar" className="text-gray-600" />
        <Tab label="Sales" value="postWebinar" className="text-gray-600" />
        <Tab
          label="Enrollments"
          value="enrollments"
          className="text-gray-600"
        />
      </Tabs>

      <div className="flex gap-4 justify-end">
        <Button
          onClick={() => setShowModal((prev) => !prev)}
          variant="outlined"
        >
          Import
        </Button>
        <Button variant="outlined">Filters</Button>
      </div>

      {/* Table Component */}
      <TableWithStickyActions page={page} setPage={setPage} />

      {showModal &&
        createPortal(
          <UpdateCsvXslxModal setModal={setShowModal} csvId={id} />,
          document.body
        )}
    </div>
  );
};

export default WebinarAttendees;
