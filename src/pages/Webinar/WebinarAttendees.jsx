import React, { useEffect, useState, lazy, Suspense, useRef } from "react";

const Pullbacks = lazy(() => import("./Pullbacks"));
const Enrollments = lazy(() => import("./Enrollments"));
const WebinarAttendeesPage = lazy(() => import("./WebinarAttendeesPage"));

import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tabs, Tab } from "@mui/material";
import { createPortal } from "react-dom";
import { AttachFile, ContentCopy } from "@mui/icons-material";
import { getLeadType } from "../../features/actions/assign";
import {
  AssignmentStatus,
  copyToClipboard,
  NotifActionType,
} from "../../utils/extra";
import { getAllEmployees } from "../../features/actions/employee";
import useAddUserActivity from "../../hooks/useAddUserActivity";
const EmployeeAssignModal = lazy(() =>
  import("../Attendees/Modal/EmployeeAssignModal")
);
const ReAssignmentModal = lazy(() =>
  import("../../components/Webinar/ReAssignmentModal")
);
const UpdateCsvXslxModal = lazy(() => import("./modal/UpdateCsvXslxModal"));
import DataTableFallback from "../../components/Fallback/DataTableFallback";
import { fetchPullbackRequestCounts } from "../../features/actions/reAssign";
import { socket } from "../../socket";
import ModalFallback from "../../components/Fallback/ModalFallback";

const WebinarAttendees = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();

  const { userData } = useSelector((state) => state.auth);
  const { reAssignCounts } = useSelector((state) => state.reAssign);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignmentType, setSelectedAssignmentType] = useState("All");
  const [isSwapOpen, setSwapOpen] = useState(false);

  const [assignModal, setAssignModal] = useState(false);
  const [reAssignModal, setReAssignModal] = useState(false);
  const webinarName = searchParams.get("webinarName");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const tabValueRef = useRef(searchParams.get("tabValue") || "preWebinar");
  const subTabValueRef = useRef(searchParams.get("subTabValue") || "attendees");

  useEffect(() => {
    setSearchParams({
      page: page,
      webinarName: webinarName,
      tabValue: tabValueRef.current,
      subTabValue: subTabValueRef.current,
    });
  }, [page]);

  useEffect(() => {
    setSearchParams({
      tabValue: tabValueRef.current,
      page: 1,
      webinarName: webinarName,
      subTabValue: subTabValueRef.current,
    });
    fetchCounts();
  }, [tabValueRef.current]);

  useEffect(() => {
    setSearchParams({
      tabValue: tabValueRef.current,
      page: 1,
      webinarName: webinarName,
      subTabValue: subTabValueRef.current,
    });
  }, [subTabValueRef.current]);

  useEffect(() => {
    dispatch(getLeadType());
    dispatch(getAllEmployees({}));
  }, []);

  function fetchCounts() {
    if (tabValueRef.current !== "enrollments") {
      dispatch(
        fetchPullbackRequestCounts({
          webinarId: id,
          status: "active",
          recordType: tabValueRef.current,
        })
      );
    }
  }

  useEffect(() => {
    function onNotification(data) {
      if (data.actionType === NotifActionType.REASSIGNMENT) {
        fetchCounts();
      }
    }
    socket.on("notification", onNotification);
    return () => {
      socket.off("notification", onNotification);
    };
  }, [tabValueRef.current, id]);

  // Tabs change handler
  const handleTabChange = (_, newValue) => {
    tabValueRef.current = newValue;
    setPage(1);
    setSelectedRows([]);
    logUserActivity({
      action: "switch",
      type: "tab",
      detailItem: newValue,
    });
  };

  const handleSubTabChange = (_, newValue) => {
    subTabValueRef.current = newValue;
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
        value={tabValueRef.current}
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
            color: "gray",
          }}
        />
      </Tabs>

      <div className="flex gap-4 justify-between flex-wrap items-center">
        <div className="flex gap-4">
          <Button
            onClick={() => copyToClipboard(id, "Webinar")}
            variant="outlined"
            endIcon={<ContentCopy />}
            style={{ textTransform: "none" }}
          >
            {id}
          </Button>

          {subTabValueRef.current === "attendees" &&
            tabValueRef.current !== "enrollments" && (
              <Button onClick={() => setSwapOpen(true)} variant="contained">
                Swap Columns
              </Button>
            )}
          {selectedRows.length > 0 &&
            (!(selectedAssignmentType === "All") ||
              subTabValueRef.current !== "attendees") && (
              <button
                className=" px-4 py-2 text-white bg-blue-500 rounded-md"
                onClick={() => {
                  if (
                    subTabValueRef.current === "attendees" &&
                    selectedAssignmentType === "Not Assigned"
                  ) {
                    setAssignModal(true);
                  } else {
                    setReAssignModal(true);
                  }
                }}
                variant="contained"
              >
                {subTabValueRef.current === "attendees" &&
                selectedAssignmentType === "Not Assigned"
                  ? "Assign"
                  : "Re-Assign"}
              </button>
            )}
          {userData?.isActive &&
            tabValueRef.current !== "enrollments" &&
            subTabValueRef.current === "attendees" &&
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

        {tabValueRef.current !== "enrollments" && (
          <Tabs
            value={subTabValueRef.current}
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
              label={
                <div className="flex items-center justify-center">
                  Pullbacks
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {reAssignCounts?.pullbacks || 0}
                  </span>
                </div>
              }
              value={AssignmentStatus.REASSIGN_APPROVED}
              className="text-gray-600"
            />
            <Tab
              label={
                <div className="flex items-center justify-center">
                  Requests
                  <span className="ml-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded">
                    {reAssignCounts?.requests || 0}
                  </span>
                </div>
              }
              value={AssignmentStatus.REASSIGN_REQUESTED}
            />
          </Tabs>
        )}
      </div>
      <Suspense fallback={<DataTableFallback />}>
        {subTabValueRef.current === "attendees" &&
          tabValueRef.current !== "enrollments" && (
            <WebinarAttendeesPage
              userData={userData}
              tabValue={tabValueRef.current}
              page={page}
              setPage={setPage}
              isSwapOpen={isSwapOpen}
              setSwapOpen={setSwapOpen}
              subTabValue={subTabValueRef.current}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              selectedAssignmentType={selectedAssignmentType}
              setSelectedAssignmentType={setSelectedAssignmentType}
            />
          )}
        {subTabValueRef.current !== "attendees" &&
          tabValueRef.current !== "enrollments" && (
            <Pullbacks
              subTabValue={subTabValueRef.current}
              page={page}
              setPage={setPage}
              tabValue={tabValueRef.current}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          )}
        {tabValueRef.current === "enrollments" && (
          <Enrollments
            page={page}
            setPage={setPage}
            tabValue={tabValueRef.current}
          />
        )}
      </Suspense>

      {reAssignModal && (
        <Suspense fallback={<ModalFallback />}>
          <ReAssignmentModal
            selectedRows={selectedRows}
            webinarid={id}
            tabValue={tabValueRef.current}
            isPullbackVisible={
              tabValueRef.current !== "enrollments" &&
              subTabValueRef.current === "attendees"
            }
            isAttendee={true}
            setReAssignModal={setReAssignModal}
          />
        </Suspense>
      )}

      {assignModal &&
        createPortal(
          <Suspense fallback={<ModalFallback />}>
            <EmployeeAssignModal
              tabValue={tabValueRef.current}
              selectedRows={selectedRows}
              setAssignModal={setAssignModal}
              webinarId={id}
            />
          </Suspense>,
          document.body
        )}

      {showModal &&
        createPortal(
          <Suspense fallback={<ModalFallback />}>
            <UpdateCsvXslxModal
              tabValue={tabValueRef.current}
              setModal={setShowModal}
              csvId={id}
            />
          </Suspense>,
          document.body
        )}
    </div>
  );
};

export default WebinarAttendees;
