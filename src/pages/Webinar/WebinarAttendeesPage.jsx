import React, {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  allAttendeesSortByOptions,
  attendeeTableColumns,
  webinarAttendeesSortByOptions,
} from "../../utils/columnData";
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
import { setWebinarAttendeesFilters } from "../../features/slices/filters.slice";
import FullScreen from "../../components/FullScreen";
import { getLocations } from "../../features/actions/location";

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

  const { locationsData } = useSelector((state) => state.location);

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

  const [selected, setSelected] = useState("All");

  const { webinarAttendeesSortBy, webinarAttendeesFilters } = useSelector(
    (state) => state.filters
  );

  useEffect(() => {
    if (
      tabValue === "preWebinar" &&
      webinarAttendeesSortBy?.sortBy === "timeInSession"
    ) {
      dispatch(
        setWebinarAttendeesFilters({
          filters: webinarAttendeesFilters,
          sortBy: {
            sortBy: webinarAttendeesSortByOptions[0].value,
            sortOrder: "asc",
          },
        })
      );
    }
  }, [tabValue, webinarAttendeesSortBy, webinarAttendeesFilters]);

  useEffect(() => {
    if (
      tabValue !== "enrollments" &&
      subTabValue === "attendees" &&
      !(
        tabValue === "preWebinar" &&
        webinarAttendeesSortBy?.sortBy === "timeInSession"
      )
    ) {
      setSelectedRows([]);
      dispatch(
        getAttendees({
          id,
          isAttended: tabValue === "postWebinar",
          page,
          limit: LIMIT,
          filters: webinarAttendeesFilters,
          validCall: selected === "All" ? undefined : selected,
          assignmentType:
            selectedAssignmentType === "All"
              ? undefined
              : selectedAssignmentType,
          sort: webinarAttendeesSortBy,
        })
      );
    }
  }, [
    page,
    tabValue,
    LIMIT,
    webinarAttendeesFilters,
    selected,
    selectedAssignmentType,
    webinarAttendeesSortBy,
  ]);

  useEffect(() => {
    if (isSuccess || assignSuccess || isSuccessReAssign) {
      dispatch(
        getAttendees({
          id,
          isAttended: tabValue === "postWebinar",
          filters: webinarAttendeesFilters,
          validCall: selected === "All" ? undefined : selected,
          assignmentType:
            selectedAssignmentType === "All"
              ? undefined
              : selectedAssignmentType,
          sort: webinarAttendeesSortBy,
          page: 1,
          limit: LIMIT,
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
      swapAttendeeFields({
        attendees: selectedRows,
        field1,
        field2,
        webinarId: id,
        isAttended: tabValue === "postWebinar",
        filters: webinarAttendeesFilters,
        validCall: selected === "All" ? undefined : selected,
        assignmentType:
          selectedAssignmentType === "All" ? undefined : selectedAssignmentType,
      })
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
    // console.log("render ===> WebinarAttendeesPage -> AttendeeDropdown");
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

  useEffect(() => {
    dispatch(
      getLocations({
        page: 1,
        limit: 1000,
        filters: undefined,
      })
    );
  }, []);
  return (
    <FullScreen>
      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="webinarAttendeesTable"
        ButtonGroup={React.memo(AttendeeDropdown)}
        isSelectVisible={userData?.isActive}
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
        filters={webinarAttendeesFilters}
        locations={locationsData}
      />

      {AttendeesFilterModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <AttendeesFilterModal
            modalName={AttendeesFilterModalName}
            setPage={setPage}
            tabValue={tabValue}
          />
        </Suspense>
      )}

      {exportModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <ExportWebinarAttendeesModal
            modalName={exportExcelModalName}
            filters={webinarAttendeesFilters}
            sort={webinarAttendeesSortBy}
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
    </FullScreen>
  );
};

export default WebinarAttendeesPage;
