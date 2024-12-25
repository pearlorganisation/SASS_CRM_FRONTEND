import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tabs, Tab, IconButton, Tooltip } from "@mui/material";
import { createPortal } from "react-dom";
import UpdateCsvXslxModal from "./modal/UpdateCsvXslxModal";
import { clearSuccess, setTabValue as setTab } from "../../features/slices/attendees";
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

const WebinarAttendees = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const exportExcelModalName = "ExportWebinarAttendeesExcel";
  const AttendeesFilterModalName = "AttendeesFilterModal";
  const employeeAssignModalName = "employeeAssignModal";
  const [tableHeader, setTableHeader] = useState("Attendees Table");
  // ----------------------- etcetra -----------------------
  const { id } = useParams();
  const dispatch = useDispatch();
  const logUserActivity = useAddUserActivity();
  const navigate = useNavigate();

  const { attendeeData, isLoading, isSuccess, totalPages } =
    useSelector((state) => state.attendee);
  const { userData } = useSelector((state) => state.auth);
  const { leadTypeData } = useSelector((state) => state.assign);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const webinarName = searchParams.get("webinarName");
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [filters, setFilters] = useState({});
  const [tabValue, setTabValue] = useState("preWebinar");

  useEffect(() => {
    setSearchParams({ page: page, webinarName: webinarName });
  }, [page]);

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

  useEffect(() => {
    dispatch(getLeadType());
  }, []);

  useEffect(() => {
    switch (tabValue) {
      case "pullbacks":
        setTableHeader("Pullbacks");
        dispatch(getPullbacks({ id, page, limit: LIMIT, filters }));

        break;

      case "postWebinar":
        setTableHeader("Post Webinar Attendees");
        dispatch(
          getAttendees({
            id,
            isAttended: tabValue === "postWebinar",
            page,
            limit: LIMIT,
            filters,
          })
        );
        break;

      case "preWebinar":
        setTableHeader("Pre Webinar Attendees");
        dispatch(
          getAttendees({
            id,
            isAttended: tabValue === "preWebinar",
            page,
            limit: LIMIT,
            filters,
          })
        );
        break;

      default:
        setTableHeader("Attendee Table");
        dispatch(
          getAttendees({
            id,
            isAttended: tabValue === "postWebinar",
            page,
            limit: LIMIT,
            filters,
          })
        );
        break;
    }
  }, [page, tabValue, LIMIT, filters]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        getAttendees({
          id,
          isAttended: tabValue === "postWebinar",
          page: 1,
          limit: LIMIT,
          filters,
        })
      );
      dispatch(clearSuccess());
    }
  }, [isSuccess]);

  // ----------------------- Action Icons -----------------------

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
    {
      icon: () => <Edit className="text-blue-500 group-hover:text-blue-600" />,
      tooltip: "Edit Attendee",
      onClick: (item) => {
        console.log(`Editing row with id: ${item?._id}`);
      },
    },
    {
      icon: (item) => (
        <Delete className="text-red-500 group-hover:text-red-600" />
      ),
      tooltip: "Delete Attendee",
      onClick: (item) => {
        console.log(`Deleting row with id: ${item?._id}`);
      },
    },
  ];
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

        <Tab label="UnAttended" value="unattended" className="text-gray-600" />
        <Tab label="Pullbacks" value="pullbacks" className="text-gray-600" />
      </Tabs>

      <div className="flex gap-4 justify-between">
        <div className="flex gap-4">
          <h2 className="text-2xl font-bold text-gray-700">{webinarName}</h2>
          <Tooltip title="Copy Webinar Id" placement="top">
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(id);
                toast.success("Copied to clipboard");
              }}
            >
              <ContentCopy className="text-blue-500 group-hover:text-blue-600" />
            </IconButton>
          </Tooltip>
        </div>
        {selectedRows.length > 0 && (
          <Button
            onClick={() => dispatch(openModal(employeeAssignModalName))}
            variant="contained"
          >
            Assign
          </Button>
        )}

        <ComponentGuard conditions={[userData?.isActive]}>
          <Button
            onClick={() => setShowModal((prev) => !prev)}
            variant="contained"
            startIcon={<AttachFile />}
          >
            Import
          </Button>
        </ComponentGuard>
      </div>
      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="webinarAttendeesTable"
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
    </div>
  );
};

export default WebinarAttendees;
