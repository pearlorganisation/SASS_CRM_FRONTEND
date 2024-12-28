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

const WebinarAttendees = () => {
  // ----------------------- ModalNames for Redux -----------------------

  const employeeAssignModalName = "employeeAssignModal";
  // ----------------------- etcetra -----------------------
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();

  const { userData } = useSelector((state) => state.auth);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const webinarName = searchParams.get("webinarName");
  const [page, setPage] = useState(searchParams.get("page") || 1);
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
            border: "1px solid red",
            color: "gray",
          }}
        />

        {/* <Tab label="UnAttended" value="unattended" className="text-gray-600" /> */}
      </Tabs>

      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-4">
          {selectedRows.length > 0 && (
            <Button
              onClick={() => dispatch(openModal(employeeAssignModalName))}
              variant="contained"
            >
              Assign
            </Button>
          )}

          <ComponentGuard
            conditions={[
              userData?.isActive,
              subTabValue === "attendees",
              tabValue !== "enrollments",
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
          employeeAssignModalName={employeeAssignModalName}
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
        />
      </ComponentGuard>
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
    employeeAssignModalName,
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
  const { isSuccess: assignSuccess } = useSelector((state) => state.assign);
  const { leadTypeData } = useSelector((state) => state.assign);
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);

  const [filters, setFilters] = useState({});
  const [showModal, setShowModal] = useState(false);
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
        })
      );
    }
  }, [page, tabValue, LIMIT, filters, selected]);

  useEffect(() => {
    if (isSuccess || assignSuccess) {
      dispatch(
        getAttendees({
          id,
          isAttended: tabValue === "postWebinar",
          page: 1,
          limit: LIMIT,
          filters,
          validCall: selected === "All" ? undefined : selected,
        })
      );
      dispatch(clearSuccess());
    }
  }, [isSuccess, assignSuccess]);

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

  const AttendeeButtonGroup = () => {
    const handleClick = (label) => {
      setSelected(label);
      setPage(1);
    };
    return (
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        <Button
          onClick={() => handleClick("All")}
          color={selected === "All" ? "secondary" : "primary"}
        >
          All
        </Button>
        <Button
          onClick={() => handleClick("Worked")}
          color={selected === "Worked" ? "secondary" : "primary"}
        >
          Worked
        </Button>
        <Button
          onClick={() => handleClick("Pending")}
          color={selected === "Pending" ? "secondary" : "primary"}
        >
          Pending
        </Button>
      </ButtonGroup>
    );
  };
  return (
    <>
      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="webinarAttendeesTable"
        ButtonGroup={AttendeeButtonGroup}
        isSelectVisible={true}
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
      <EmployeeAssignModal
        tabValue={tabValue}
        selectedRows={selectedRows.map((rowId) => ({
          attendee: rowId,
          recordType: tabValue,
        }))}
        modalName={employeeAssignModalName}
        webinarId={id}
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
      {showModal &&
        createPortal(
          <UpdateCsvXslxModal setModal={setShowModal} csvId={id} />,
          document.body
        )}
    </>
  );
};
