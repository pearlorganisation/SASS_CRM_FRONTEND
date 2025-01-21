import React, { lazy, Suspense, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import {
  clearSuccess,
  setTabValue as setTab,
} from "../../features/slices/attendees";
import {
  getAttendees,
  swapAttendeeFields,
} from "../../features/actions/attendees";
import { attendeeTableColumns } from "../../utils/columnData";
import { Visibility } from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
const AttendeesFilterModal = lazy(() =>
  import("../../components/Attendees/AttendeesFilterModal")
);
import { resetReAssignSuccess } from "../../features/slices/reAssign.slice";
import { resetAssignSuccess } from "../../features/slices/assign";
const ExportWebinarAttendeesModal = lazy(() =>
  import("../../components/Export/ExportWebinarAttendeesModal")
);
const SwapAttendeeFieldsModal = lazy(() =>
  import("../../components/Webinar/SwapAttendeeFieldsModal")
);
import { createPortal } from "react-dom";
import ModalFallback from "../../components/Fallback/ModalFallback";

const WebinarAttendeesPage = (props) => {
  const {
    tabValue,
    page,
    setPage,
    userData,
    isSwapOpen,
    setSwapOpen,
    subTabValue,
    selectedRows,
    setSelectedRows,
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

  const handleColumnSwap = (field1, field2) => {
    dispatch(
      swapAttendeeFields({ attendees: selectedRows, field1, field2 })
    ).then((res) => {
      res?.meta?.requestStatus === "fulfilled" && setSelectedRows([]);
    });
  };

  const AttendeeDropdown = () => {
    const handleChange = (event) => {
      const label = event.target.value;
      setSelected(label);
      setPage(1);
    };

    const handleAssignmentChange = (event) => {
      const label = event.target.value;
      setSelectedRows([]);
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
        isSelectVisible={userData?.isActive}
        filters={filters}
        setFilters={setFilters}
        tableData={{
          columns:
            tabValue === "postWebinar"
              ? attendeeTableColumns
              : attendeeTableColumns.filter(
                  (item) => item.key !== "timeInSession"
                ),
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
      {isSwapOpen &&
        createPortal(
          <Suspense fallback={<ModalFallback />}>
            <SwapAttendeeFieldsModal
              onClose={() => setSwapOpen(false)}
              onSubmit={handleColumnSwap}
            />
          </Suspense>,
          document.body
        )}
    </>
  );
};

export default WebinarAttendeesPage;
