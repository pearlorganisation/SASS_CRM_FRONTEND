import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupedAttendees } from "../../features/actions/attendees";
import {
  attendeeTableColumns,
  groupedAttendeeTableColumns,
} from "../../utils/columnData";
import { MdVisibility } from "react-icons/md";
import DataTable from "../../components/Table/DataTable";
import { closeModal, openModal } from "../../features/slices/modalSlice";
import AttendeesFilterModal from "../../components/Attendees/AttendeesFilterModal";
import ExportWebinarAttendeesModal from "../../components/Export/ExportWebinarAttendeesModal";
import { getLeadType } from "../../features/actions/assign";
import Dialog from "../../components/Dialog/Dialog";
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

  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);
  const modalState = useSelector((state) => state.modals.modals);
  const exportModalOpen = modalState[exportExcelModalName] ? true : false;
  const AttendeesFilterModalOpen = modalState[AttendeesFilterModalName]
    ? true
    : false;

  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [filters, setFilters] = useState({});

  const setDataFilters = (data) => {
    setFilters(data);
    setPage(1);
  };

  useEffect(() => {
    setSearchParams({ page: page });
  }, [page]);

  useEffect(() => {
    dispatch(fetchGroupedAttendees({ page, limit: LIMIT, filters }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, LIMIT, filters]);

  useEffect(() => {
    dispatch(getLeadType());

    return () => {
      dispatch(clearAttendeeData());
    }
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
        filters={filters}
        setFilters={setDataFilters}
        tableData={{
          columns: groupedAttendeeTableColumns,
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
        limit={LIMIT}
        filterModalName={AttendeesFilterModalName}
        exportModalName={exportExcelModalName}
        isLoading={isLoading}
        isLeadType={true}
      />
      {/* <AttendeesFilterModal
        modalName={AttendeesFilterModalName}
        filters={filters}
        setFilters={setFilters}
      />
      <ExportWebinarAttendeesModal
        modalName={exportExcelModalName}
        filters={filters}
      /> */}
      {console.log("AttendeesFilterModalOpen", )}
      {AttendeesFilterModalOpen && createPortal(
        <GroupedAttendeeFilterModal
        filters={filters}
        setFilters={setDataFilters}
        modalName={AttendeesFilterModalName} />,
        document.body
      )}
    </div>
  );
};

export default WebinarAttendees;
