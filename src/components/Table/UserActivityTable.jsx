import React from "react";
import PageLimitEditor from "../PageLimitEditor";
import {
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";

const UserActivityTable = (props) => {
  const { page, setPage } = props;

  const { userActivities, totalPages } = useSelector(
    (state) => state.userActivity
  );
  return (
    <>
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
          <PageLimitEditor pageId={"activityLogs"} />
        </div>
      )}
    </>
  );
};

export default UserActivityTable;
