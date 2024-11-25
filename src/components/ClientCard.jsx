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
} from "@mui/material";
import { formatDateAsNumber } from "../utils/extra";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ClientCard = (props) => {
  const { item, handleDeleteClient, handleEditClient, handleViewClient } =
    props;
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card elevation={3}>
        <CardContent>
          {/* Header: User Info */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <div>
              <Typography variant="h6" fontWeight="bold">
                {item?.userName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {item?.email}
              </Typography>
            </div>
          </Box>

          {/* Plan Details */}
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            <strong>Plan Name:</strong> Premium
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

          {/* Phone Number */}
          <Typography variant="subtitle2" color="textSecondary">
            <strong>Phone:</strong> {item?.phone || "N/A"}
          </Typography>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <Chip
              label={item?.isActive ? "Active" : "Inactive"}
              color={item?.isActive ? "success" : "error"}
              size="small"
            />
            <div>
              <Tooltip title="View Client Info" arrow>
                <IconButton
                  color="primary"
                  onClick={() => handleViewClient(item?._id)}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Client" arrow>
                <IconButton
                  color="primary"
                  onClick={() => handleEditClient(item?._id)}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Inactivate/Delete Client" arrow>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteClient(item?._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ClientCard;
