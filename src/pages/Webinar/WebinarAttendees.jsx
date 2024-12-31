import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  ButtonGroup,
  Modal,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { createPortal } from "react-dom";
import UpdateCsvXslxModal from "./modal/UpdateCsvXslxModal";
import {
  clearSuccess,
  setTabValue as setTab,
} from "../../features/slices/attendees";
import { getAttendees } from "../../features/actions/attendees";
import { attendeeTableColumns } from "../../utils/columnData";
import {
  Edit,
  Delete,
  Visibility,
  AttachFile,
  ContentCopy,
} from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
import EmployeeAssignModal from "../Attendees/Modal/EmployeeAssignModal";
import { openModal } from "../../features/slices/modalSlice";
import AttendeesFilterModal from "../../components/Attendees/AttendeesFilterModal";
import ExportWebinarAttendeesModal from "../../components/Export/ExportWebinarAttendeesModal";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import { getLeadType, getPullbacks } from "../../features/actions/assign";
import { toast } from "sonner";
import Pullbacks from "./Pullbacks";
import { AssignmentStatus } from "../../utils/extra";
import ReAssignmentModal from "../../components/Webinar/ReAssignmentModal";
import { getAllEmployees } from "../../features/actions/employee";
import Enrollments from "./Enrollments";
import { resetReAssignSuccess } from "../../features/slices/reAssign.slice";
import { resetAssignSuccess } from "../../features/slices/assign";

const WebinarAttendees = () => {
  // ----------------------- ModalNames for Redux -----------------------

  const employeeAssignModalName = "employeeAssignModal";
  const reAssignmentModalName = "ReAssignmentModal";
  // ----------------------- etcetra -----------------------
  const { id } = useParams();
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();

  const { userData } = useSelector((state) => state.auth);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [isSelectVisible, setIsSelectVisible] = useState(false);
  const [selectedAssignmentType, setSelectedAssignmentType] = useState("All");

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
    dispatch(setTab(newValue));
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
          <ComponentGuard conditions={[selectedRows.length > 0]}>
            <Button
              onClick={() => {
                if (
                  subTabValue === "attendees" &&
                  selectedAssignmentType === "Not Assigned"
                ) {
                  dispatch(openModal(employeeAssignModalName));
                } else {
                  dispatch(openModal(reAssignmentModalName));
                }
              }}
              variant="contained"
            >
              {subTabValue === "attendees" &&
              selectedAssignmentType === "Not Assigned"
                ? "Assign"
                : "Re-Assign"}
            </Button>
          </ComponentGuard>
          <ComponentGuard
            conditions={[
              userData?.isActive,
              tabValue !== "enrollments",
              subTabValue === "attendees",
              selectedRows.length === 0,
            ]}
          >
            <Button
              onClick={() => setShowModal((prev) => !prev)}
              variant="contained"
              startIcon={<AttachFile />}
            >
              Import
            </Button>
          </ComponentGuard>
        </div>

        <ComponentGuard conditions={[tabValue !== "enrollments"]}>
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
        </ComponentGuard>
      </div>
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

      <ComponentGuard
        conditions={[subTabValue !== "attendees", tabValue !== "enrollments"]}
      >
        <Pullbacks
          subTabValue={subTabValue}
          page={page}
          setPage={setPage}
          tabValue={tabValue}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </ComponentGuard>

      <ComponentGuard conditions={[tabValue === "enrollments"]}>
        <Enrollments page={page} setPage={setPage} tabValue={tabValue} />
      </ComponentGuard>

      <ReAssignmentModal
        selectedRows={selectedRows}
        webinarid={id}
        tabValue={tabValue}
        modalName={reAssignmentModalName}
        isPullbackVisible={
          tabValue !== "enrollments" && subTabValue === "attendees"
        }
        isAttendee={true}
      />

      <EmployeeAssignModal
        tabValue={tabValue}
        selectedRows={selectedRows.map((rowId) => ({
          attendee: rowId,
          recordType: tabValue,
        }))}
        modalName={employeeAssignModalName}
        webinarId={id}
      />

      {showModal &&
        createPortal(
          <UpdateCsvXslxModal setModal={setShowModal} csvId={id} />,
          document.body
        )}
    </div>
  );
};

export default WebinarAttendees;

const WebinarAttendeesPage = (props) => {
  const {
    tabValue,
    page,
    setPage,
    subTabValue,
    selectedRows,
    setSelectedRows,
    isSelectVisible,
    setIsSelectVisible,
    setSelectedAssignmentType,
    selectedAssignmentType,
  } = props;

  const tableHeader = "Attendees Table";
  const exportExcelModalName = "ExportWebinarAttendeesExcel";
  const AttendeesFilterModalName = "AttendeesFilterModal";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { attendeeData, isLoading, isSuccess, totalPages } = useSelector(
    (state) => state.attendee
  );
  const { isSuccess: isSuccessReAssign } = useSelector(
    (state) => state.reAssign
  );
  const { leadTypeData, isSuccess: assignSuccess } = useSelector(
    (state) => state.assign
  );
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);

  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    if (tabValue !== "enrollments" && subTabValue === "attendees") {
      dispatch(
        getAttendees({
          id,
          isAttended: tabValue === "postWebinar",
          page,
          limit: LIMIT,
          filters,
          validCall: selected === "All" ? undefined : selected,
          assignmentType:
            selectedAssignmentType === "All"
              ? undefined
              : selectedAssignmentType,
        })
      );
    }
  }, [page, tabValue, LIMIT, filters, selected, selectedAssignmentType]);

  useEffect(() => {
    if (isSuccess || assignSuccess || isSuccessReAssign) {
      console.log("isssucess", isSuccess, assignSuccess, isSuccessReAssign);
      dispatch(
        getAttendees({
          id,
          isAttended: tabValue === "postWebinar",
          page: 1,
          limit: LIMIT,
          filters,
          validCall: selected === "All" ? undefined : selected,
          assignmentType:
            selectedAssignmentType === "All"
              ? undefined
              : selectedAssignmentType,
        })
      );
      dispatch(clearSuccess());
      dispatch(resetReAssignSuccess());
      dispatch(resetAssignSuccess());
      setSelectedRows([]);
    }
  }, [isSuccess, assignSuccess, isSuccessReAssign]);

  const actionIcons = [
    {
      icon: () => (
        <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
      ),
      tooltip: "View Attendee Info",
      onClick: (item) => {
        navigate(
          `/particularContact?email=${item?.email}&attendeeId=${item?._id}`
        );
      },
      readOnly: true,
    },
  ];

  const AttendeeDropdown = () => {
    const handleChange = (event) => {
      const label = event.target.value;
      setSelected(label);
      setPage(1);
    };

    const handleAssignmentChange = (event) => {
      const label = event.target.value;
      if (label === "All") {
        setIsSelectVisible(false);
        setSelectedRows([]);
      } else {
        setIsSelectVisible(true);
        setSelectedRows([]);
      }
      setSelectedAssignmentType(label);
      setPage(1);
    };

    return (
      <div className="flex gap-4">
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

        <FormControl className="w-40 " variant="outlined">
          <InputLabel id="attendee-label">Assignment</InputLabel>
          <Select
            labelId="attendee-label"
            className="h-10"
            value={selectedAssignmentType}
            onChange={handleAssignmentChange}
            label="Assignment"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Assigned">Assigned</MenuItem>
            <MenuItem value="Not Assigned"> Not Assigned</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  };
  return (
    <>
      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="webinarAttendeesTable"
        ButtonGroup={AttendeeDropdown}
        isSelectVisible={isSelectVisible}
        filters={filters}
        setFilters={setFilters}
        tableData={{
          columns: attendeeTableColumns,
          rows: attendeeData.map((row) => ({
            ...row,
            leadType: leadTypeData.find((lead) => lead._id === row?.leadType),
          })),
        }}
        actions={actionIcons}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        limit={LIMIT}
        filterModalName={AttendeesFilterModalName}
        exportModalName={exportExcelModalName}
        isLoading={isLoading}
        isLeadType={true}
      />
      <AttendeesFilterModal
        modalName={AttendeesFilterModalName}
        filters={filters}
        setFilters={setFilters}
      />
      <ExportWebinarAttendeesModal
        modalName={exportExcelModalName}
        filters={filters}
        webinarId={id}
        isAttended={tabValue === "postWebinar" ? true : false}
      />
    </>
  );
};
