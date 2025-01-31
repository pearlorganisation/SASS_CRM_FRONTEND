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

  const modalState = useSelector((state) => state.modals.modals);
  const exportModalOpen = modalState[exportExcelModalName] ? true : false;
  const AttendeesFilterModalOpen = modalState[AttendeesFilterModalName]
    ? true
    : false;

  // ------------------------------------------------------------------

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { attendeeData, isLoading, pagination, isSuccess } = useSelector(
    (state) => state.attendee
  );
  const { total = 0, totalPages = 1 } = pagination;

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
      setSelectedRows([]);
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
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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
    console.log("render ===> WebinarAttendeesPage -> AttendeeDropdown");
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
        ButtonGroup={React.memo(AttendeeDropdown)}
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
          totalRecords: total,
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

      {AttendeesFilterModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <AttendeesFilterModal
            modalName={AttendeesFilterModalName}
            filters={filters}
            setFilters={setFilters}
          />
        </Suspense>
      )}

      {exportModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <ExportWebinarAttendeesModal
            modalName={exportExcelModalName}
            filters={filters}
            webinarId={id}
            isAttended={tabValue === "postWebinar" ? true : false}
            validCall={selected === "All" ? undefined : selected}
            assignmentType={
              selectedAssignmentType === "All"
                ? undefined
                : selectedAssignmentType
            }
          />
        </Suspense>
      )}

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
