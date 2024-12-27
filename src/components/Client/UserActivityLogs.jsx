import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Divider,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserActivity } from "../../features/actions/userActivity";
import {
  CheckCircleOutline,
  ErrorOutline,
  ExpandMore,
} from "@mui/icons-material";
import PageLimitEditor from "../PageLimitEditor";
import UserActivityTable from "../Table/UserActivityTable";

const UserActivityLogs = ({ isActive, id }) => {
  const dispatch = useDispatch();
  const { userActivities } = useSelector((state) => state.userActivity);
  const LIMIT = useSelector((state) => state.pageLimits["activityLogs"] || 10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getUserActivity({ id, page: page, limit: LIMIT }));
  }, [page, LIMIT]);
  return (
    <Paper elevation={3} className="p-4">
      <div className="flex items-center gap-5">
        <Typography variant="h6" gutterBottom>
          Status
        </Typography>
        <Chip
          label={isActive ? "Active" : "Inactive"}
          color={isActive ? "success" : "error"}
          icon={isActive ? <CheckCircleOutline /> : <ErrorOutline />}
          className="mb-2"
        />
      </div>
      <Typography>
        <strong>Last Activity:</strong>{" "}
        {Array.isArray(userActivities) && userActivities.length > 0
          ? new Date(userActivities[0]?.createdAt).toLocaleString()
          : "N/A"}
      </Typography>
      <Divider className="mb-3" />

      {/* Accordion for User Activity Logs */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="user-activity-logs-content"
          id="user-activity-logs-header"
        >
          <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
            Client Activity Logs
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Table for Activity Logs */}
          <UserActivityTable page={page} setPage={setPage} />
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default UserActivityLogs;
