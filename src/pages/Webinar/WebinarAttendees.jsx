import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tabs, Tab } from "@mui/material";
import { createPortal } from "react-dom";
import UpdateCsvXslxModal from "./modal/UpdateCsvXslxModal";
import { clearSuccess, setTabValue } from "../../features/slices/attendees";
import { getAttendees } from "../../features/actions/attendees";
import { attendeeTableColumns } from "../../utils/columnData";
import { Edit, Delete, Visibility, AttachFile } from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
import EmployeeAssignModal from "../Attendees/Modal/EmployeeAssignModal";
import { openModal } from "../../features/slices/modalSlice";

const WebinarAttendees = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const exportExcelModalName = "ExportAttendeesExcel";
  const AttendeesFilterModalName = "AttendeesFilterModal";
  const employeeAssignModalName = "employeeAssignModal";
  const tableHeader = "Attendees Table";
  // ----------------------- etcetra -----------------------
  const { id } = useParams();
  const dispatch = useDispatch();

  const { attendeeData, isLoading, isSuccess, totalPages, tabValue } =
    useSelector((state) => state.attendee);
  const { selectedRows } = useSelector((state) => state.table);
  const [showModal, setShowModal] = useState(false);

  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [filters, setFilters] = useState({});

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

  // ----------------------- Action Icons -----------------------

  const actionIcons = [
    {
      icon: () => (
        <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
      ),
      tooltip: "View Attendee Info",
      onClick: (item) => {
        console.log(`Viewing details for row with id: ${item?._id}`);
      },
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
      </Tabs>

      <div className="flex gap-4 justify-end">
        {
          selectedRows.length > 0 && (
            <Button
              onClick={() => dispatch(openModal(employeeAssignModalName))}
              variant="contained"
            >
              Assign
            </Button>
          )
        }
        <Button
          onClick={() => setShowModal((prev) => !prev)}
          variant="contained"
          startIcon={<AttachFile />}
        >
          Import
        </Button>
      </div>

      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="webinarAttendeesTable"
        isSelectVisible={true}
        filters={filters}
        setFilters={setFilters}
        tableData={{
          columns: attendeeTableColumns,
          rows: attendeeData,
        }}
        actions={actionIcons}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        limit={LIMIT}
        filterModalName={AttendeesFilterModalName}
        exportModalName={exportExcelModalName}
        isLoading={isLoading}
      />
      <EmployeeAssignModal modalName={employeeAssignModalName} />
      {showModal &&
        createPortal(
          <UpdateCsvXslxModal setModal={setShowModal} csvId={id} />,
          document.body
        )}
    </div>
  );
};

export default WebinarAttendees;
