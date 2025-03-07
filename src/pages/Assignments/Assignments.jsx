import React, { useEffect, useState, useLayoutEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ButtonGroup,
} from "@mui/material";
import { attendeeTableColumns } from "../../utils/columnData";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
import {
  getAssignments,
  requestReAssignment,
} from "../../features/actions/assign";
import AttendeesFilterModal from "../../components/Attendees/AttendeesFilterModal";
import { getEmployeeWebinars } from "../../features/actions/webinarContact";
import {
  resetAssignedData,
  resetAssignSuccess,
} from "../../features/slices/assign";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import { AssignmentStatus, NotifActionType } from "../../utils/extra";
import { socket } from "../../socket";
import RequestReassignmentModal from "./ReAssigmentModal";
import { createPortal } from "react-dom";

const Assignments = () => {
  const employeeId = useParams()?.id;
  const navigate = useNavigate();
  const addUserActivity = useAddUserActivity();

  // ----------------------- ModalNames for Redux -----------------------
  const filterModalName = "ViewAssignmentsFilterModal";
  const tableHeader = "Assignments Table";
  const exportExcelModalName = "ExportViewAssignmentsExcel";
  // ----------------------- etcetra -----------------------
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState([]);

  const { userData } = useSelector((state) => state.auth);
  const { assignData, isLoading, isSuccess, totalPages, assignLoading } =
    useSelector((state) => state.assign);

  const { webinarData } = useSelector((state) => state.webinarContact);
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const modalState = useSelector((state) => state.modals.modals);
  const filterModalOpen = modalState[filterModalName] ? true : false;

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [filters, setFilters] = useState({});
  const [currentWebinar, setCurrentWebinar] = useState(
    searchParams.get("webinarId") || ""
  );
  const [selected, setSelected] = useState("All");
  const [tabValue, setTabValue] = useState(
    searchParams.get("tabValue") || AssignmentStatus.ACTIVE
  );
  const [openReassignModal, setOpenReassignModal] = useState(false);

  useEffect(() => {
    setSearchParams({
      page: page,
      webinarId: currentWebinar,
      tabValue,
      limit: LIMIT,
    });
  }, [page, currentWebinar, tabValue, LIMIT]);

  useEffect(() => {
    if (currentWebinar) {
      dispatch(
        getAssignments({
          id: employeeId || userData?._id,
          page,
          limit: LIMIT,
          filters,
          webinarId: currentWebinar,
          validCall: selected === "All" ? undefined : selected,
          assignmentStatus: tabValue,
        })
      );
    }
  }, [page, LIMIT, filters, selected, tabValue, currentWebinar]);

  useEffect(() => {
    if (isSuccess) {
      setSelectedRows([]);
      setOpenReassignModal(false);
      dispatch(resetAssignSuccess());
      if (totalPages > 1 && currentWebinar)
        console.log("333333333333333 ---> ");

      dispatch(
        getAssignments({
          id: employeeId || userData?._id,
          page: 1,
          limit: LIMIT,
          filters,
          webinarId: currentWebinar,
          validCall: selected === "All" ? undefined : selected,
          assignmentStatus: tabValue,
        })
      );
    }
  }, [isSuccess]);

  useLayoutEffect(() => {
    dispatch(getEmployeeWebinars({ employeeId }));
    return () => {
      dispatch(resetAssignedData());
    };
  }, []);

  useEffect(() => {
    if (
      Array.isArray(webinarData) &&
      webinarData.length > 0 &&
      !currentWebinar
    ) {
      setCurrentWebinar(webinarData[0]._id);
      setPage(1);
    }
  }, [webinarData]);

  useEffect(() => {
    function onNotification(data) {
      if (
        currentWebinar &&
        (data.actionType === NotifActionType.ASSIGNMENT ||
          data.actionType === NotifActionType.REASSIGNMENT)
      )
        if (page === 1) {
          console.log("888888888888 ---> ", currentWebinar);

          dispatch(
            getAssignments({
              id: employeeId || userData?._id,
              page: 1,
              limit: LIMIT,
              filters,
              webinarId: currentWebinar,
              validCall: selected === "All" ? undefined : selected,
              assignmentStatus: tabValue,
            })
          );
        } else setPage(1);
    }
    socket.on("notification", onNotification);
    return () => {
      socket.off("notification", onNotification);
    };
  }, [page, LIMIT, filters, selected, tabValue, currentWebinar]);

  const handleViewFullDetails = (item) => {
    const recordType = item?.isAttended ? "postWebinar" : "preWebinar";
    navigate(
      `/particularContact?email=${item?.email}&attendeeId=${item?.attendeeId}`
    );
    addUserActivity({
      action: "viewDetails",
      details: `User viewed details of Attendee with Email: ${item?._id} and Record Type: ${recordType}`,
    });
  };

  const handleReassignRequest = (requestReason) => {
    dispatch(
      requestReAssignment({
        assignments: selectedRows,
        webinarId: currentWebinar,
        requestReason,
      })
    );
  };

  // ----------------------- Action Icons -----------------------

  const actionIcons = [
    {
      icon: () => (
        <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
      ),
      tooltip: "View Attendee Info",
      onClick: (item) => {
        handleViewFullDetails(item);
      },
    },
  ];

  const AttendeeDropdown = () => {
    const handleChange = (event) => {
      const label = event.target.value;
      setSelected(label);
      setPage(1);
    };

    return (
      <FormControl className="w-40 " variant="outlined">
        <InputLabel id="attendee-label">Activity</InputLabel>
        <Select
          labelId="attendee-label"
          className="h-10"
          value={selected}
          onChange={handleChange}
          label="Activity"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Worked">Worked</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>
      </FormControl>
    );
  };
  return (
    <div className="px-6 md:px-10 pt-10 space-y-6">
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        centered
        className="border-b border-gray-200"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab
          label="Assignments"
          value={AssignmentStatus.ACTIVE}
          className="text-gray-600"
        />
        <Tab
          label="ReAssignments"
          value={AssignmentStatus.REASSIGN_REQUESTED}
          className="text-gray-600"
        />
      </Tabs>

      <div
        className={`flex items-center gap-4 justify-between`}
      >
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(`/employee-assign-metrics`)}
            className="h-10"
            variant="contained"
          >
            Assign Metrics
          </Button>

          {selectedRows.length > 0 &&
            userData?.isActive &&
            tabValue === AssignmentStatus.ACTIVE && (
            <Button
              onClick={() => setOpenReassignModal(true)}
              className="h-10"
              variant="contained"
            >
              Request ReAssignment
            </Button>
          )}
        </div>
        <FormControl className="w-60">
          <InputLabel id="webinar-label">Webinar</InputLabel>
          <Select
            labelId="webinar-label"
            label="Webinar"
            value={currentWebinar}
            onChange={(e) => {
              setCurrentWebinar(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="" disabled>
              Select Webinar
            </MenuItem>
            {webinarData.map((webinar, index) => (
              <MenuItem key={index} value={webinar._id}>
                {webinar.webinarName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="viewAssignmentsTable"
        ButtonGroup={AttendeeDropdown}
        isSelectVisible={
          (employeeId || !userData?.isActive ? false : true) &&
          tabValue === AssignmentStatus.ACTIVE
        }
        filters={filters}
        setFilters={setFilters}
        tableData={{
          columns: attendeeTableColumns.filter(
            (column) => column.header !== "Assigned To"
          ), //  { header: "Webinar", key: "webinarName", width: 20, type: "" },
          rows: Array.isArray(assignData) ? assignData : [],
        }}
        actions={actionIcons}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        limit={LIMIT}
        filterModalName={filterModalName}
        exportModalName={exportExcelModalName}
        isLoading={isLoading}
      />

      {filterModalOpen && (
        <AttendeesFilterModal
          modalName={filterModalName}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      {openReassignModal &&
        createPortal(
          <RequestReassignmentModal
            onClose={() => setOpenReassignModal(false)}
            onSubmit={(reason) => handleReassignRequest(reason)}
          />,
          document.body
        )}
    </div>
  );
};

export default Assignments;
