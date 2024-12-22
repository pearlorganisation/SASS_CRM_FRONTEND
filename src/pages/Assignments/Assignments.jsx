import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tabs, Tab } from "@mui/material";
import { attendeeTableColumns } from "../../utils/columnData";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
import { openModal } from "../../features/slices/modalSlice";
import { getAssignments } from "../../features/actions/assign";
import AttendeesFilterModal from "../../components/Attendees/AttendeesFilterModal";

const Assignments = () => {

  const navigate = useNavigate();


  // ----------------------- ModalNames for Redux -----------------------
  const filterModalName = "ViewAssignmentsFilterModal";
  const tableHeader = "Assignments Table";
  const exportExcelModalName = "ExportViewAssignmentsExcel";
  // ----------------------- etcetra -----------------------
  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState([]);

  const { userData } = useSelector((state) => state.auth);
  const { assignData, isLoading, isSuccess, totalPages } = useSelector(
    (state) => state.assign
  );
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  useEffect(() => {
    dispatch(
      getAssignments({ id: userData?._id, page, limit: LIMIT, filters })
    );
  }, [page, LIMIT, filters]);

  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess]);


  const handleViewFullDetails = (item) => {

    const recordType = item?.isAttended ? 'postWebinar' : 'preWebinar'
    navigate(
      `/particularContact?email=${encodeURIComponent(
        item?.email
      )}`
    );
    if (isEmployee) {
      dispatch(addUserActivity({
        action: "viewDetails",
        details: `User viewed details of Attendee with Email: ${item?._id} and Record Type: ${recordType}`
      }))
    }

  };




  // ----------------------- Action Icons -----------------------

  const actionIcons = [
    {
      icon: () => (
        <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
      ),
      tooltip: "View Attendee Info",
      onClick: (item) => {
        console.log(item)
        handleViewFullDetails(item)
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
    <div className="px-6 md:px-10 pt-14 space-y-6">
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
        tableUniqueKey="viewAssignmentsTable"
        // isSelectVisible={true}
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
        // selectedRows={selectedRows}
        // setSelectedRows={setSelectedRows}
        limit={LIMIT}
        filterModalName={filterModalName}
        exportModalName={exportExcelModalName}
        isLoading={isLoading}
      />

      <AttendeesFilterModal
        modalName={filterModalName}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default Assignments;
