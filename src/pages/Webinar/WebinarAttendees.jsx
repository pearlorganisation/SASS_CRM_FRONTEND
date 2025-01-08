import React, { useEffect, useState, lazy, Suspense } from "react";

const Pullbacks = lazy(() => import("./Pullbacks"));
const Enrollments = lazy(() => import("./Enrollments"));
const WebinarAttendeesPage = lazy(() => import("./WebinarAttendeesPage"));

import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tabs, Tab } from "@mui/material";
import { createPortal } from "react-dom";
import { AttachFile } from "@mui/icons-material";
import { getLeadType } from "../../features/actions/assign";
import { AssignmentStatus } from "../../utils/extra";
import { getAllEmployees } from "../../features/actions/employee";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import EmployeeAssignModal from "../Attendees/Modal/EmployeeAssignModal";
import ReAssignmentModal from "../../components/Webinar/ReAssignmentModal";
import UpdateCsvXslxModal from "./modal/UpdateCsvXslxModal";
import DataTableFallback from "../../components/Fallback/DataTableFallback";

const WebinarAttendees = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();

  const { userData } = useSelector((state) => state.auth);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [selectedAssignmentType, setSelectedAssignmentType] = useState("All");

  const [assignModal, setAssignModal] = useState(false);
  const [reAssignModal, setReAssignModal] = useState(false);
  const webinarName = searchParams.get("webinarName");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [tabValue, setTabValue] = useState(
    searchParams.get("tabValue") || "preWebinar"
  );
  const [subTabValue, setSubTabValue] = useState(
    searchParams.get("subTabValue") || "attendees"
  );

  useEffect(() => {
    setSearchParams({
      page: page,
      webinarName: webinarName,
      tabValue: tabValue,
      subTabValue: subTabValue,
    });
  }, [page]);

  useEffect(() => {
    setSearchParams({
      tabValue: tabValue,
      page: 1,
      webinarName: webinarName,
      subTabValue: subTabValue,
    });
  }, [tabValue]);

  useEffect(() => {
    setSearchParams({
      tabValue: tabValue,
      page: 1,
      webinarName: webinarName,
      subTabValue: subTabValue,
    });
  }, [subTabValue]);

  useEffect(() => {
    dispatch(getLeadType());
    dispatch(getAllEmployees({}));
  }, []);

  // Tabs change handler
  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setPage(1);
    setSelectedRows([]);
    logUserActivity({
      action: "switch",
      type: "tab",
      detailItem: newValue,
    });
  };

  const handleSubTabChange = (_, newValue) => {
    setSubTabValue(newValue);
    setSelectedRows([]);
    setPage(1);
    // logUserActivity({
    //   action: "switch",
    //   type: "tab",
    //   detailItem: newValue,
    // });
  };

  // ----------------------- Action Icons -----------------------

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
          style={{
            // border: "1px solid red",
            color: "gray",
          }}
        />

        {/* <Tab label="UnAttended" value="unattended" className="text-gray-600" /> */}
      </Tabs>

      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-4">
          {selectedRows.length > 0 && (
            <button
              className=" px-4 py-2 text-white bg-blue-500 rounded-md"
              onClick={() => {
                if (
                  subTabValue === "attendees" &&
                  selectedAssignmentType === "Not Assigned"
                ) {
                  setAssignModal(true);
                } else {
                  setReAssignModal(true);
                }
              }}
              variant="contained"
            >
              {subTabValue === "attendees" &&
              selectedAssignmentType === "Not Assigned"
                ? "Assign"
                : "Re-Assign"}
            </button>
          )}
          {userData?.isActive &&
            tabValue !== "enrollments" &&
            subTabValue === "attendees" &&
            selectedRows.length === 0 && (
              <Button
                onClick={() => setShowModal((prev) => !prev)}
                variant="contained"
                startIcon={<AttachFile />}
              >
                Import
              </Button>
            )}
        </div>

        {tabValue !== "enrollments" && (
          <Tabs
            value={subTabValue}
            onChange={handleSubTabChange}
            centered
            className="border-b border-gray-200"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="Attendees"
              value="attendees"
              className="text-gray-600"
            />
            <Tab
              label="Pullbacks"
              value={AssignmentStatus.REASSIGN_APPROVED}
              className="text-gray-600"
            />
            <Tab label="Requests" value={AssignmentStatus.REASSIGN_REQUESTED} />

            {/* <Tab label="UnAttended" value="unattended" className="text-gray-600" /> */}
          </Tabs>
        )}
      </div>
      <Suspense fallback={<DataTableFallback/>}>
        {subTabValue === "attendees" && tabValue !== "enrollments" && (
          <WebinarAttendeesPage
            tabValue={tabValue}
            page={page}
            setPage={setPage}
            subTabValue={subTabValue}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            isSelectVisible={isSelectVisible}
            setIsSelectVisible={setIsSelectVisible}
            selectedAssignmentType={selectedAssignmentType}
            setSelectedAssignmentType={setSelectedAssignmentType}
          />
        )}
        {subTabValue !== "attendees" && tabValue !== "enrollments" && (
          <Pullbacks
            subTabValue={subTabValue}
            page={page}
            setPage={setPage}
            tabValue={tabValue}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        )}
        {tabValue === "enrollments" && (
          <Enrollments page={page} setPage={setPage} tabValue={tabValue} />
        )}
      </Suspense>

      {reAssignModal && (
        <ReAssignmentModal
          selectedRows={selectedRows}
          webinarid={id}
          tabValue={tabValue}
          isPullbackVisible={
            tabValue !== "enrollments" && subTabValue === "attendees"
          }
          isAttendee={true}
          setReAssignModal={setReAssignModal}
        />
      )}

      {assignModal && (
        <EmployeeAssignModal
          tabValue={tabValue}
          selectedRows={selectedRows.map((rowId) => ({
            attendee: rowId,
            recordType: tabValue,
          }))}
          setAssignModal={setAssignModal}
          webinarId={id}
        />
      )}

      {showModal &&
        createPortal(
          <UpdateCsvXslxModal setModal={setShowModal} csvId={id} />,
          document.body
        )}
    </div>
  );
};

export default WebinarAttendees;
