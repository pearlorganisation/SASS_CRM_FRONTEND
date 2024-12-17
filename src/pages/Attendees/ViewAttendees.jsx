import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tabs, Tab } from "@mui/material";
import { clearSuccess } from "../../features/slices/attendees";
import { getAllAttendees } from "../../features/actions/attendees";
import { attendeeTableColumns } from "../../utils/columnData";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
import EmployeeAssignModal from "../Attendees/Modal/EmployeeAssignModal";
import { openModal } from "../../features/slices/modalSlice";
import AttendeesFilterModal from "../../components/Attendees/AttendeesFilterModal";
import ExportWebinarAttendeesModal from "../../components/Export/ExportWebinarAttendeesModal";

const WebinarAttendees = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const AttendeesFilterModalName = "ViewAttendeesFilterModal";
  const employeeAssignModalName = "ViewEmployeeAssignModal";
  const tableHeader = "Attendees Table";
  const exportExcelModalName = "ExportViewAttendeesExcel";
  // ----------------------- etcetra -----------------------
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState([]);

  const { attendeeData, isLoading, isSuccess, totalPages } = useSelector(
    (state) => state.attendee
  );
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  useEffect(() => {
    dispatch(getAllAttendees({ page, limit: LIMIT, filters }));
  }, [page, LIMIT, filters]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(getAllAttendees({ page: 1, limit: LIMIT, filters }));
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

      <div className="flex gap-4 justify-end">
        {selectedRows.length > 0 && (
          <Button
            onClick={() => dispatch(openModal(employeeAssignModalName))}
            variant="contained"
          >
            Assign
          </Button>
        )}
      </div>

      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="ViewAttendeesTable"
        isSelectVisible={true}
        filters={filters}
        setFilters={setFilters}
        tableData={{
          columns: [
            ...attendeeTableColumns,
            { header: "Webinar", key: "webinarName", width: 20, type: "" },
          ],
          rows: attendeeData,
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
        selectedRows={selectedRows}
        modalName={employeeAssignModalName}
      />
      <AttendeesFilterModal
        modalName={AttendeesFilterModalName}
        filters={filters}
        setFilters={setFilters}
      />
      <ExportWebinarAttendeesModal
        modalName={exportExcelModalName}
        filters={filters}
      />
    </div>
  );
};

export default WebinarAttendees;
