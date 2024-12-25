import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import { Tab, Tabs } from "@mui/material";
import { getUserActivity } from "../../features/actions/userActivity";
import { useDispatch, useSelector } from "react-redux";
import UserActivityTable from "../../components/Table/UserActivityTable";
import DataTable from "../../components/Table/DataTable";
import { attendeeTableColumns } from "../../utils/columnData";
import AttendeesFilterModal from "../../components/Attendees/AttendeesFilterModal";
import { getAssignments, getAssignmentsActivity } from "../../features/actions/assign";
import { Delete, Edit, Visibility } from "@mui/icons-material";

const ViewEmployee = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const filterModalName = "ViewAssignmentsFilterModal";
  const tableHeader = "Employee Assignments Table";
  const exportExcelModalName = "ExportViewAssignmentsExcel";
  // ----------------------- etcetra -----------------------
  const { id } = useParams();
  const logUserActivity = useAddUserActivity();
  const dispatch = useDispatch();

  const { assignData, isLoading, isSuccess, totalPages } = useSelector(
    (state) => state.assign
  );
  const [tabValue, setTabValue] = useState("assignments");
  const LIMIT = useSelector((state) => state.pageLimits[tabValue] || 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    console.log("tabValue", tabValue);
    if (tabValue === "activityLogs")
      dispatch(getUserActivity({ id, page: page, limit: LIMIT }));
    else if(tabValue === "activity")
      dispatch(getAssignmentsActivity({empId:id}));
    else
      dispatch(getAssignments({ id, page, limit: LIMIT, filters }));
  }, [page, LIMIT, filters, tabValue]);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setPage(1);
    logUserActivity({
      action: "switch",
      type: "tab",
      detailItem: newValue,
    });
  };
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
        <Tab
          label="Assignments"
          value="assignments"
          className="text-gray-600"
        />
        <Tab label="History" value="history" className="text-gray-600" />
        <Tab
          label="Activity Logs"
          value="activityLogs"
          className="text-gray-600"
        />
         <Tab
          label="Activity"
          value="activity"
          className="text-gray-600"
        />
      </Tabs>

      {tabValue === "activityLogs" && (
        <div className="p-6 bg-gray-50 rounded-lg">
          <div className="flex gap-4 justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-6">
              Employee Activity logs
            </h2>
          </div>
          <UserActivityTable page={page} setPage={setPage} />
        </div>
      )}
      {(tabValue === "history" || tabValue === "assignments")  && (
        <div className="px-6 md:px-10 pt-14 space-y-6">
          {/* Tabs for Sales and Reminder */}

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
      )}
    </div>
  );
};

export default ViewEmployee;
