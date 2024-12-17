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

const UserActivityLogs = ({ isActive, id }) => {
  const dispatch = useDispatch();
  const { userActivities, totalPages } = useSelector(
    (state) => state.userActivity
  );
  const LIMIT = useSelector((state) => state.pageLimits["userActivity"] || 10);
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
          <Typography  variant="subtitle1" style={{ fontWeight: "bold" }}>Client Activity Logs</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Table for Activity Logs */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Details</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Created At</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(userActivities) && userActivities.length > 0 ? (
                  userActivities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {activity.action}
                      </TableCell>
                      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {activity.details}
                      </TableCell>
                      <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {new Date(activity.createdAt).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{
                        color: "#999",
                        fontStyle: "italic",
                        padding: "20px",
                      }}
                    >
                      No Logs to Display
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {Array.isArray(userActivities) && userActivities.length > 0 && (
            <div className="flex gap-4 md:flex-row flex-col flex-wrap items-center justify-between py-4">
              <Pagination
                onChange={(e, page) => {
                  setPage(page);
                }}
                count={totalPages || 1}
                variant="outlined"
                shape="rounded"
              />
              <PageLimitEditor pageId={"userActivity"} />
            </div>
          )}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default UserActivityLogs;
