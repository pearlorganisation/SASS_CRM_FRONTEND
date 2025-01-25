import React, { useEffect } from "react";
import {
  Card,
  Typography,
  Divider,
  Grid,
  Chip,
  Box,
  Paper,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import PeopleIcon from "@mui/icons-material/People";
import { getClientById } from "../../features/actions/client";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../utils/extra";
import useRoles from "../../hooks/useRoles";
import UserActivityLogs from "../../components/Client/UserActivityLogs";
import { Delete, ExpandMore, Visibility } from "@mui/icons-material";
import {
  deleteUserDocumet,
  getUserDocuments,
} from "../../features/actions/auth";

const ViewClient = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const roles = useRoles();

  const { singleClientData } = useSelector((state) => state.client);

  const [clientData = null] = singleClientData || [];

  useEffect(() => {
    dispatch(getClientById(id));
  }, []);

  return (
    <Box className="py-10 md:px-10 px-4 mt-10">
      {/* Header Section */}
      <Card
        className="p-8 shadow-lg"
        style={{
          background: clientData?.isActive
            ? "linear-gradient(90deg, #4CAF50, #2E7D32)" // Green gradient
            : "linear-gradient(90deg, #FF5252, #D32F2F)", // Red gradient
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
              {clientData?.userName}
            </Typography>
            <Typography variant="subtitle1">
              {clientData?.companyName}
            </Typography>
          </Grid>
        </Grid>
      </Card>

      {/* Main Details */}
      <Grid container spacing={4} mt={4}>
        {/* Basic Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-3">
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider />
            <Box display="flex" alignItems="center" className="mt-2" mb={2}>
              <EmailIcon color="primary" className="mr-2" />
              <Typography>
                <strong>Email:</strong> {clientData?.email}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <PhoneIcon color="primary" className="mr-2" />
              <Typography>
                <strong>Contact:</strong> {clientData?.phone}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Employee Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="px-4 py-2">
            <Typography variant="h6" gutterBottom>
              Employee Summary
            </Typography>
            <Divider className="mb-3" />
            <Box display="flex" alignItems="center" mt={1} mb={1}>
              <PeopleIcon color="" className="mr-2" />
              <Typography>
                <strong>Limit:</strong>{" "}
                {Array.isArray(clientData?.subscription) &&
                clientData.subscription.length > 0
                  ? clientData.subscription[0].employeeLimit +
                    clientData.subscription[0].employeeLimitAddon
                  : 0}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <PeopleIcon color="primary" className="mr-2" />
              <Typography>
                <strong>Sales:</strong>{" "}
                {
                  clientData?.employees.filter(
                    (item) => item.role === roles.EMPLOYEE_SALES
                  ).length
                }
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <PeopleIcon color="secondary" className="mr-2" />
              <Typography>
                <strong>Reminder:</strong>{" "}
                {
                  clientData?.employees.filter(
                    (item) => item.role === roles.EMPLOYEE_REMINDER
                  ).length
                }
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Contact Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-3">
            <Typography variant="h6" gutterBottom>
              Contact Usage
            </Typography>
            <Divider />
            <Typography mt={1} variant="body1" gutterBottom>
              <strong>Limit:</strong>{" "}
              {Array.isArray(clientData?.subscription) &&
              clientData.subscription.length > 0
                ? clientData.subscription[0].contactLimit +
                  clientData.subscription[0].contactLimitAddon
                : 0}
            </Typography>
            <Typography variant="body1">
              <strong>Used:</strong> {clientData?.contactsCount}
            </Typography>
          </Paper>
        </Grid>

        {/* Plan Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-3">
            <Typography variant="h6" gutterBottom>
              Plan Details
            </Typography>
            <Divider className="mb-3" />
            <Box display="flex" className="mt-2" alignItems="center" mb={0.5}>
              <Typography>
                <strong>Type:</strong> {clientData?.plan?.name}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography>
                <strong>Expiry:</strong>{" "}
                {formatDate(clientData?.currentPlanExpiry)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="user-activity-logs-content"
                id="user-activity-logs-header"
              >
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  Client Documents
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Array.isArray(clientData?.documents)
                  ? clientData.documents.map((doc, index) => (
                      <div
                        className="flex justify-between items-center mb-2 shadow-md"
                        key={index}
                      >
                        <Typography variant="body1">
                          {doc?.originalname}
                        </Typography>

                        <div className="flex gap-4">
                          <Tooltip title="Open" arrow>
                            <button
                              onClick={() =>
                                dispatch(getUserDocuments(doc?.filename))
                              }
                              className="p-2 rounded-lg text-indigo-500 hover:text-indigo-600 duration-150 hover:bg-gray-50"
                            >
                              <Visibility />
                            </button>
                          </Tooltip>

                          {/* <Tooltip title="Delete" arrow>
                          <button
                            onClick={() => dispatch(deleteUserDocumet(doc?.filename))}
                            className="p-2 rounded-lg text-red-500 hover:text-red-600 duration-150 hover:bg-gray-50"
                          >
                            <Delete />
                          </button>
                        </Tooltip> */}
                        </div>
                      </div>
                    ))
                  : null}
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="px-3 py-1">
            <Typography variant="h6" gutterBottom>
              Active/Inactive Note
            </Typography>
            <Divider />
            <Typography mt={1} variant="body1" gutterBottom>
              {clientData?.statusChangeNote}
            </Typography>
          </Paper>
        </Grid>

        {/* Status */}
        <Grid item xs={12}>
          <UserActivityLogs id={id} isActive={clientData?.isActive} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewClient;
