import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Box, TextField, Grid, Tabs, Tab } from "@mui/material";
import TableWithStickyActions from "../Test/TableWithStickyActions"; // Assuming this is your table component
import { createPortal } from "react-dom";
import UpdateCsvXslxModal from "./UpdateCsvXslxModal";
import { setTabValue } from "../../features/slices/attendees";
import { getAttendees } from "../../features/actions/attendees";

const WebinarAttendees = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { tabValue, attendeeData } = useSelector((state) => state.attendee);
  const [showModal, setShowModal] = useState(false);

  // Tabs change handler
  const handleTabChange = (event, newValue) => {
    dispatch(setTabValue(newValue));
  };

  useEffect(() => {
    dispatch(getAttendees({ id, isAttended: tabValue }));
  }, [tabValue]);

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
      <TableWithStickyActions />

      {showModal &&
        createPortal(
          <UpdateCsvXslxModal setModal={setShowModal} csvId={id} />,
          document.body
        )}
    </div>
  );
};

export default WebinarAttendees;
