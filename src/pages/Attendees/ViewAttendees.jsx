import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupedAttendees } from "../../features/actions/attendees";
import { groupedAttendeeTableColumns } from "../../utils/columnData";
import { MdVisibility } from "react-icons/md";
import DataTable from "../../components/Table/DataTable";
import { getLeadType } from "../../features/actions/assign";
import GroupedAttendeeFilterModal from "./Modal/GroupedAttendeeFilterModal";
import { createPortal } from "react-dom";
import { clearAttendeeData } from "../../features/slices/attendees";

const WebinarAttendees = () => {
  // ----------------------- ModalNames for Redux -----------------------
  const AttendeesFilterModalName = "ViewAttendeesFilterModal";
  const tableHeader = "All Attendees Table";
  const exportExcelModalName = "ExportViewAttendeesExcel";
  // ----------------------- etcetra -----------------------
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { leadTypeData } = useSelector((state) => state.assign);
  const { attendeeData, isLoading, pagination } = useSelector(
    (state) => state.attendee
  );
  const { total, totalPages } = pagination;

  const { allAttendeesFilters, allAttendeesSortBy } = useSelector((state) => state.filters);
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const modalState = useSelector((state) => state.modals.modals);
  const exportModalOpen = modalState[exportExcelModalName] ? true : false;
  const AttendeesFilterModalOpen = modalState[AttendeesFilterModalName]
    ? true
    : false;

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  useEffect(() => {
    dispatch(
      fetchGroupedAttendees({
        page,
        limit: LIMIT,
        filters: allAttendeesFilters,
        sort: allAttendeesSortBy,
      })
    );
  }, [page, LIMIT, allAttendeesSortBy, allAttendeesFilters]);

  useEffect(() => {
    dispatch(getLeadType());

    return () => {
      dispatch(clearAttendeeData()); 
    };
  }, []);

  // ----------------------- Action Icons -----------------------

  const actionIcons = [
    {
      icon: () => (
        <MdVisibility
          size={24}
          className="text-indigo-500 group-hover:text-indigo-600"
        />
      ),
      tooltip: "View Attendee Info",
      onClick: (item) => {
        navigate(
          `/particularContact?email=${item?._id}&attendeeId=${item?.attendeeId}`
        );
      },
    },
  ];
  return (
    <div className="px-6 md:px-10 pt-14 space-y-6">
      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="ViewAttendeesTable"
        tableData={{
          columns: groupedAttendeeTableColumns,
          totalRecords: total,
          rows: attendeeData.map((row) => ({
            ...row,
            leadType: leadTypeData.find((lead) => lead._id === row?.leadType),
          })),
        }}
        filters={allAttendeesFilters}
        actions={actionIcons}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        limit={LIMIT}
        filterModalName={AttendeesFilterModalName}
        exportModalName={exportExcelModalName}
        isLoading={isLoading}
        isLeadType={true}
      />
      {AttendeesFilterModalOpen &&
        createPortal(
          <GroupedAttendeeFilterModal
            setPage={setPage}
            modalName={AttendeesFilterModalName}
          />,
          document.body
        )}
    </div>
  );
};

export default WebinarAttendees;
