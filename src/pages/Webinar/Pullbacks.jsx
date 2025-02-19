import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReAssignments,
  handleReAssigmentRequest,
} from "../../features/actions/reAssign";
import { useNavigate, useParams } from "react-router-dom";
import { pullbacksTableColumns } from "../../utils/columnData";
import DataTable from "../../components/Table/DataTable";
import { Cancel, CheckCircle, Visibility } from "@mui/icons-material";
import { AssignmentStatus, NotifActionType } from "../../utils/extra";
import ReAssignmentModal from "../../components/Webinar/ReAssignmentModal";
import { resetReAssignSuccess } from "../../features/slices/reAssign.slice";
import { socket } from "../../socket";

const Pullbacks = (props) => {
  const tableHeader = "Re-Assignments";

  const { id } = useParams();
  const {
    tabValue,
    subTabValue,
    page,
    setPage,
    selectedRows,
    setSelectedRows,
  } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reAssignData, totalPages, isLoading, isSuccess, requestLoading } = useSelector(
    (state) => state.reAssign
  );
  const LIMIT = useSelector((state) => state.pageLimits[tableHeader] || 10);

  useEffect(() => {
    function fetchData() {
      dispatch(
        fetchReAssignments({
          webinarId: id,
          status: subTabValue,
          recordType: tabValue,
          page,
          limit: LIMIT,
        })
      );
    }

    function onNotification(data) {
      console.log(data.actionType, subTabValue, AssignmentStatus.REASSIGN_REQUESTED);
      if (
        data.actionType === NotifActionType.REASSIGNMENT &&
        subTabValue === AssignmentStatus.REASSIGN_REQUESTED
      ) {
        fetchData();
      }
    }
    fetchData();
    socket.on("notification", onNotification);
    return () => {
      socket.off("notification", onNotification);
    };
  }, [subTabValue, LIMIT, page, tabValue]);

  useEffect(() => {
    if (isSuccess) {
      console.log("isssucess", isSuccess);
      setSelectedRows([]);
      dispatch(
        fetchReAssignments({
          webinarId: id,
          status: subTabValue,
          recordType: tabValue,
          page: 1,
          limit: LIMIT,
        })
      );

      dispatch(resetReAssignSuccess());
    }
  }, [isSuccess]);

  const actionIcons = [
    {
      icon: () => (
        <CheckCircle className="text-green-500 group-hover:text-green-600" />
      ),
      tooltip: "Accept Re-Assignment Request",
      disabled: requestLoading,
      hideCondition: (row) =>
        row?.status !== AssignmentStatus.REASSIGN_APPROVED,
      onClick: (item) => {
        dispatch(
          handleReAssigmentRequest({
            status: "approved",
            assignments: [item?._id],
            userId: item?.user,
            webinarId: item?.webinar,
          })
        );
      },
    },
    {
      icon: () => <Cancel className="text-red-500 group-hover:text-red-600" />,
      tooltip: "Reject Re-Assignment Request",
      disabled: requestLoading,
      hideCondition: (row) =>
        row?.status !== AssignmentStatus.REASSIGN_APPROVED,
      onClick: (item) => {
        dispatch(
          handleReAssigmentRequest({
            status: "rejected",
            assignments: [item?._id],
            userId: item?.user,
            webinarId: item?.webinar,
          })
        );
      },
    },
    {
      icon: () => (
        <Visibility className="text-indigo-500 group-hover:text-indigo-600" />
      ),
      tooltip: "View Attendee Info",
      onClick: (item) => {
        navigate(
          `/particularContact?email=${item?.attendeeEmail}&attendeeId=${item?.attendee}`
        );
      },
      readOnly: true,
    },
  ];
  return (
    <>
      <DataTable
        tableHeader={tableHeader}
        tableUniqueKey="webinarReAssignmentsAttendeesTable"
        isSelectVisible={true}
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        tableData={{
          columns: pullbacksTableColumns.map((column) => {
            if (
              column.header === "Assigned To" &&
              subTabValue === AssignmentStatus.REASSIGN_APPROVED
            ) {
              return {
                ...column,
                header: "Previous Assigned To",
              };
            }
            if (
              column.header === "Reason" &&
              subTabValue === AssignmentStatus.REASSIGN_APPROVED
            ) {
              return {};
            }
            return column;
          }),
          rows: reAssignData,
        }}
        actions={actionIcons}
        totalPages={totalPages}
        page={page}
        setPage={setPage}
        limit={LIMIT}
        isLoading={isLoading}
      />
    </>
  );
};

export default Pullbacks;
