import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Modal, Box, TextField, Grid, Tabs, Tab } from "@mui/material";
import TableWithStickyActions from "../Test/TableWithStickyActions"; // Assuming this is your table component
import { createPortal } from "react-dom";
import UpdateCsvXslxModal from "./UpdateCsvXslxModal";

const WebinarAttendees = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState("sales");
  const [showModal, setShowModal] = useState(false);

  // Tabs change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        <Tab label="Sales" value="sales" className="text-gray-600" />
        <Tab label="Reminder" value="reminder" className="text-gray-600" />
      </Tabs>

      <div className="flex gap-4 justify-end">
        <Button onClick={() => setShowModal(prev => !prev)} variant="outlined">Import</Button>
        <Button variant="outlined">Filters</Button>
      </div>

      {/* Table Component */}
      <TableWithStickyActions />

      {showModal &&
        createPortal(
        <UpdateCsvXslxModal
            setModal={setShowModal}
            csvId={id}
        />,
        document.body
        )}
    </div>
  );
};

export default WebinarAttendees;
