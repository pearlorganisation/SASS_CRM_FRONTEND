import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tabs, Tab } from "@mui/material";  
import { clearSuccess } from "../../features/slices/attendees";
import { getAllAttendees } from "../../features/actions/attendees";
import { attendeeTableColumns } from "../../utils/columnData";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import DataTable from "../../components/Table/DataTable";
import { openModal } from "../../features/slices/modalSlice";
import AttendeesFilterModal from "../../components/Attendees/AttendeesFilterModal";
import ExportWebinarAttendeesModal from "../../components/Export/ExportWebinarAttendeesModal";
import { getLeadType } from "../../features/actions/assign";

const WebinarAttendees = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const AttendeesFilterModalName = "ViewAttendeesFilterModal";
  const employeeAssignModalName = "ViewEmployeeAssignModal";
  const tableHeader = "Attendees Table";
  const exportExcelModalName = "ExportViewAttendeesExcel";
  // ----------------------- etcetra -----------------------
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedRows, setSelectedRows] = useState([]);

  const { leadTypeData } = useSelector((state) => state.assign);
  const { attendeeData, isLoading, isSuccess, totalPages } = useSelector(
    (state) => state.attendee
  );

  const { locationsData } = useSelector(
    (state) => state.location
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

    useEffect(() => {
      dispatch(getLeadType());
    }, []);

  // ----------------------- Action Icons -----------------------

  const actionIcons = [
    {
      icon: () => (
        <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
      ),
      tooltip: "View Attendee Info",
      onClick: (item) => {
        navigate(`/particularContact?email=${item?.email}&attendeeId=${item?._id}` );
      },
    },
  ];
  return (
    <div className="px-6 md:px-10 pt-14 space-y-6">
      {/* Tabs for Sales and Reminder */}

      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="ViewAttendeesTable"
        filters={filters}
        setFilters={setFilters}
        tableData={{
          columns: [
            ...attendeeTableColumns,
            { header: "Webinar", key: "webinarName", width: 20, type: "" },
          ],
          rows: attendeeData.map((row) => ({
            ...row,
            leadType: leadTypeData.find((lead) => lead._id === row?.leadType),
          })),
        }}
        actions={actionIcons}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        limit={LIMIT}
        filterModalName={AttendeesFilterModalName}
        exportModalName={exportExcelModalName}
        isLoading={isLoading}
        locations={locationsData}
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
