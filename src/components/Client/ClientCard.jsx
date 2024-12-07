import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Tooltip,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import { formatDateAsNumber } from "../../utils/extra";
import { getRoleNameByID } from "../../utils/roles";

const ClientCard = (props) => {
  const { item, actions } = props;

  // Helper to filter employees by role
  const getRoleCount = (roleName) => {
    return Array.isArray(item?.employees)
      ? item.employees.filter((emp) => getRoleNameByID(emp?.role) === roleName)
          .length
      : 0;
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card elevation={3}>
        <CardContent>
          {/* Header: User Info */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <div>
              <Typography variant="h6" fontWeight="bold">
                {item?.userName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {item?.email}
              </Typography>
            </div>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Company Details */}
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            <strong>Company:</strong> {item?.companyName || "N/A"}
          </Typography>

          {/* Plan Details */}
          <Typography variant="subtitle2" color="textSecondary">
            <strong>Plan Name:</strong> {item?.plan?.name || "N/A"}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            <strong>Start Date:</strong>{" "}
            {Array.isArray(item?.subscription) && item?.subscription.length > 0
              ? formatDateAsNumber(item?.subscription[0]?.startDate)
              : "N/A"}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            <strong>Plan Expiry:</strong>{" "}
            {formatDateAsNumber(item?.currentPlanExpiry)}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            <strong>Contact Limit:</strong>{" "}
            {Array.isArray(item?.subscription) && item?.subscription.length > 0
              ? item?.subscription[0]?.contactLimit
              : "N/A"}
          </Typography>

          {/* Employee Information */}
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            <strong>Total Employees:</strong> {item?.employees?.length || 0}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            <strong>Sales Employees:</strong> {getRoleCount("EMPLOYEE SALES")}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            <strong>Reminder Employees:</strong> {getRoleCount("EMPLOYEE REMINDER")}
          </Typography>

          {/* Phone Number */}
          <Typography variant="subtitle2" color="textSecondary">
            <strong>Phone:</strong> {item?.phone || "N/A"}
          </Typography>

          <Divider sx={{ my: 1 }} />

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Chip
              label={item?.isActive ? "Active" : "Inactive"}
              color={item?.isActive ? "success" : "error"}
              size="small"
            />
            <div className="flex gap-2 ">
                  {actions?.map((action, index) => (
                    <div key={index}>
                      <Tooltip title={action.tooltip} arrow>
                        <IconButton
                          className="group"
                          onClick={() => action.onClick(item)}
                        >
                          {action.icon(item)}
                        </IconButton>
                      </Tooltip>
                    </div>
                  ))}
                </div>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ClientCard;
