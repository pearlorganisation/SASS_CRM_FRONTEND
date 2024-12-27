import React, { useEffect, useState, useLayoutEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { openModal } from "../../features/slices/modalSlice";
import { getAssignments } from "../../features/actions/assign";
import AttendeesFilterModal from "../../components/Attendees/AttendeesFilterModal";
import { getEmployeeWebinars } from "../../features/actions/webinarContact";
import { resetAssignedData } from "../../features/slices/assign";
import useAddUserActivity from "../../hooks/useAddUserActivity";

const Assignments = () => {
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
  const { assignData, isLoading, isSuccess, totalPages } = useSelector(
    (state) => state.assign
  );

  const { webinarData } = useSelector((state) => state.webinarContact);
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [filters, setFilters] = useState({});
  const [currentWebinar, setCurrentWebinar] = useState("");
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  useEffect(() => {
    if (currentWebinar)
      dispatch(
        getAssignments({
          id: userData?._id,
          page,
          limit: LIMIT,
          filters,
          webinarId: currentWebinar,
          validCall: selected === "All" ? undefined : selected,
        })
      );
  }, [page, LIMIT, filters, selected]);

  useEffect(() => {
    if (currentWebinar)
      dispatch(
        getAssignments({
          id: userData?._id,
          page: 1,
          limit: LIMIT,
          filters,
          webinarId: currentWebinar,
          validCall: selected === "All" ? undefined : selected,
        })
      );
  }, [currentWebinar]);

  useEffect(() => {
    if (isSuccess) {
    }
  }, [isSuccess]);

  useLayoutEffect(() => {
    dispatch(getEmployeeWebinars());
    return () => {
      dispatch(resetAssignedData());
    };
  }, []);

  useEffect(() => {
    if (Array.isArray(webinarData) && webinarData.length > 0) {
      setCurrentWebinar(webinarData[0]._id);
    }
  }, [webinarData]);

  const handleViewFullDetails = (item) => {
    const recordType = item?.isAttended ? "postWebinar" : "preWebinar";
    navigate(
      `/particularContact?email=${item?.email}&attendeeId=${item?.attendeeId}`
    );
    dispatch(
      addUserActivity({
        action: "viewDetails",
        details: `User viewed details of Attendee with Email: ${item?._id} and Record Type: ${recordType}`,
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

  const AttendeeButtonGroup = () => {
    const handleClick = (label) => {
      setSelected(label); // Update state on button click
      console.log(`${label} button clicked`);
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
          onClick={() => handleClick("Valid")}
          color={selected === "Valid" ? "secondary" : "primary"}
        >
          Valid
        </Button>
        <Button
          onClick={() => handleClick("Not Valid")}
          color={selected === "Not Valid" ? "secondary" : "primary"}
        >
          Not Valid
        </Button>
      </ButtonGroup>
    );
  };
  return (
    <div className="px-6 md:px-10 pt-14 space-y-6">
      {/* Tabs for Sales and Reminder */}

      <div className="flex gap-4 justify-end">
        <FormControl className="w-60">
          <InputLabel id="webinar-label">Webinar</InputLabel>
          <Select
            labelId="webinar-label"
            label="Webinar"
            value={currentWebinar}
            onChange={(e) => setCurrentWebinar(e.target.value)}
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
        // ButtonGroup={AttendeeButtonGroup}
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
