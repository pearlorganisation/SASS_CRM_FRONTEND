import React from "react";
import {
  Card,
  Typography,
  Divider,
  Grid,
  Chip,
  Box,
  Paper,
  Avatar,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ViewClient = () => {
  const clientData = {
    companyName: "Tech Innovators Inc.",
    email: "info@techinnovators.com",
    contactNumber: "+1-800-555-1234",
    employeeTypes: {
      sales: 3,
      reminder: 5,
    },
    contactLimit: 500,
    usedContacts: 320,
    plan: {
      type: "Premium",
      expiry: "2024-12-31",
      purchaseDate: "2024-01-01",
    },
    status: {
      isActive: true,
      lastActive: "2024-11-20 14:35:00",
    },
  };

  return (
    <Box className="p-10 mt-10">
      {/* Header Section */}
      <Card
        className="p-8 shadow-lg"
        style={{
          background: "linear-gradient(90deg, #4CAF50, #2E7D32)",
          color: "white",
          borderRadius: "16px",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: 64,
                height: 64,
              }}
            >
              <BusinessIcon style={{ fontSize: 40, color: "white" }} />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h4" component="h1">
              {clientData.companyName}
            </Typography>
            <Typography variant="subtitle1">
              {clientData.status.isActive ? "Active Client" : "Inactive Client"}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Main Details */}
      <Grid container spacing={4} mt={4}>
        {/* Basic Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4">
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider className="mb-3" />
            <Box display="flex" alignItems="center" mb={2}>
              <EmailIcon color="primary" className="mr-2" />
              <Typography>
                <strong>Email:</strong> {clientData.email}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <PhoneIcon color="primary" className="mr-2" />
              <Typography>
                <strong>Contact:</strong> {clientData.contactNumber}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Employee Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4">
            <Typography variant="h6" gutterBottom>
              Employee Summary
            </Typography>
            <Divider className="mb-3" />
            <Box display="flex" alignItems="center" mb={2}>
              <PeopleIcon color="primary" className="mr-2" />
              <Typography>
                <strong>Sales:</strong> {clientData.employeeTypes.sales}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <PeopleIcon color="secondary" className="mr-2" />
              <Typography>
                <strong>Reminder:</strong> {clientData.employeeTypes.reminder}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4">
            <Typography variant="h6" gutterBottom>
              Contact Usage
            </Typography>
            <Divider className="mb-3" />
            <Typography variant="body1" gutterBottom>
              <strong>Limit:</strong> {clientData.contactLimit}
            </Typography>
            <Typography variant="body1">
              <strong>Used:</strong> {clientData.usedContacts}
            </Typography>
          </Paper>
        </Grid>

        {/* Plan Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4">
            <Typography variant="h6" gutterBottom>
              Plan Details
            </Typography>
            <Divider className="mb-3" />
            <Box display="flex" alignItems="center" mb={0.5}>
              <Typography>
                <strong>Type:</strong> {clientData.plan.type}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography>
                <strong>Expiry:</strong> {clientData.plan.expiry}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Status */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            className="p-4"
            style={{
              backgroundColor: clientData.status.isActive
                ? "#E8F5E9"
                : "#FFEBEE",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Status
            </Typography>
            <Divider className="mb-3" />
            <Chip
              label={clientData.status.isActive ? "Active" : "Inactive"}
              color={clientData.status.isActive ? "success" : "error"}
              icon={
                clientData.status.isActive ? (
                  <CheckCircleOutlineIcon />
                ) : (
                  <ErrorOutlineIcon />
                )
              }
              className="mb-2"
            />
            <Typography>
              <strong>Last Active:</strong> {clientData.status.lastActive}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewClient;
