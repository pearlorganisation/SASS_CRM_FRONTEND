import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useAddUserActivity from "../../hooks/useAddUserActivity";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { getUserActivity } from "../../features/actions/userActivity";
import { useDispatch, useSelector } from "react-redux";
import UserActivityTable from "../../components/Table/UserActivityTable";
import DataTable from "../../components/Table/DataTable";
import { attendeeTableColumns } from "../../utils/columnData";
import AttendeesFilterModal from "../../components/Attendees/AttendeesFilterModal";
import { getAssignments } from "../../features/actions/assign";
import Visibility from "@mui/icons-material/Visibility";
import { AssignmentStatus } from "../../utils/extra";
import { useLayoutEffect } from "react";
import { getEmployeeWebinars } from "../../features/actions/webinarContact";

const ViewEmployee = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const filterModalName = "ViewAssignmentsFilterModal";
  const tableHeader = "Employee Assignments Table";
  const exportExcelModalName = "ExportViewAssignmentsExcel";
  // ----------------------- etcetra -----------------------
  const { id } = useParams();
  const logUserActivity = useAddUserActivity();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  
  const { webinarAttendeesSortBy, webinarAttendeesFilters } = useSelector(
    (state) => state.filters
  );
  const { assignData, isLoading, isSuccess, totalPages } =
    useSelector((state) => state.assign);
  const { webinarData } = useSelector((state) => state.webinarContact);
  const modalState = useSelector((state) => state.modals.modals);
  const filterModalOpen = modalState[filterModalName] ? true : false;

  const [tabValue, setTabValue] = useState(
    searchParams.get("tabValue") || "assignments"
  );
  const LIMIT = useSelector((state) => state.pageLimits[tabValue] || 10);
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [currentWebinar, setCurrentWebinar] = useState(
    searchParams.get("webinarId") || ""
  );

  useEffect(() => {
    setSearchParams({ page: page, tabValue: tabValue });
  }, [page, tabValue]);

  useEffect(() => {
    console.log("tabValue", tabValue);
    if (tabValue === "activityLogs")
      dispatch(getUserActivity({ id, page: page, limit: LIMIT }));
    else if (tabValue === "history" && currentWebinar)
      dispatch(
        getAssignments({
          id,
          page,
          limit: LIMIT,
          filters: webinarAttendeesFilters,
          webinarId: currentWebinar,
          assignmentStatus: AssignmentStatus.ACTIVE,
          validCall: "Worked",
        })
      );
    else if (currentWebinar)
      dispatch(
        getAssignments({
          id,
          page,
          limit: LIMIT,
          filters: webinarAttendeesFilters,
          assignmentStatus: AssignmentStatus.ACTIVE,
          validCall: "Pending",
          webinarId: currentWebinar ? currentWebinar : undefined,
        })
      );
  }, [page, LIMIT, tabValue, webinarAttendeesFilters, currentWebinar]);

  useLayoutEffect(() => {
    dispatch(getEmployeeWebinars({ employeeId: id }));
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
        navigate(
          `/particularContact?email=${item?.email}&attendeeId=${item?._id}`
        );
      },
    },
  ];

  const WebinarDropdown = () => {
    return (
      <div className="flex gap-4">
        <FormControl className="w-40">
          <InputLabel id="webinar-label">Webinar</InputLabel>
          <Select
            labelId="webinar-label"
            label="Webinar"
            className="h-10"
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
    );
  };

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
      {(tabValue === "history" || tabValue === "assignments") && (
        <div className="px-6 md:px-10 pt-14 space-y-6">
          {/* Tabs for Sales and Reminder */}

          <DataTable
            tableHeader={tableHeader}
            ButtonGroup={WebinarDropdown}
            tableUniqueKey="viewAssignmentsTable"
            // isSelectVisible={true}
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
          {filterModalOpen && (
            <AttendeesFilterModal
              modalName={filterModalName}
              setPage={setPage}

            />
          )}
        </div>
      )}
    </div>
  );
};

export default ViewEmployee;
