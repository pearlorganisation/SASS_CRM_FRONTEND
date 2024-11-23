import React, { useState } from "react";
import {
  Card,
  Typography,
  Grid,
  Box,
  Button,
  Divider,
  TextField,
} from "@mui/material";
// import { DatePicker } from "@mui/x-date-pickers";
import { Bar } from "react-chartjs-2";
// Register the required components
// Import necessary modules from chart.js
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  // Register the required components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  // Dummy data
  const data = {
    accountsCreated: 120,
    activeAccounts: 90,
    revenue: "$15,000",
    totalAdmins: 12,
    totalEmployees: 340,
    totalContacts: {
      used: 1200,
      remaining: 800,
    },
  };

  const contactChartData = {
    labels: ["Used", "Remaining"],
    datasets: [
      {
        label: "Contacts",
        data: [data.totalContacts.used, data.totalContacts.remaining],
        backgroundColor: ["#3b82f6", "#10b981"],
      },
    ],
  };

  return (
    <Box className="p-10">
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Date Range Picker
      <Box display="flex" gap={2} alignItems="center" marginBottom={4}>
        <Typography variant="subtitle1">Filter by Date Range:</Typography>
        <DatePicker
          label="Start Date"
          value={dateRange.start}
          onChange={(newValue) => setDateRange({ ...dateRange, start: newValue })}
        />
        <DatePicker
          label="End Date"
          value={dateRange.end}
          onChange={(newValue) => setDateRange({ ...dateRange, end: newValue })}
        />
        <Button variant="contained" color="primary">
          Apply
        </Button>
      </Box> */}

      {/* Metrics Cards */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="p-4 shadow">
            <Typography variant="h6">Accounts Created</Typography>
            <Typography variant="h3" color="primary">
              {data.accountsCreated}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="p-4 shadow">
            <Typography variant="h6">Active Accounts</Typography>
            <Typography variant="h3" color="success">
              {data.activeAccounts}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="p-4 shadow">
            <Typography variant="h6">Overall Revenue</Typography>
            <Typography variant="h3" color="secondary">
              {data.revenue}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="p-4 shadow">
            <Typography variant="h6">Total Admins</Typography>
            <Typography variant="h3" color="primary">
              {data.totalAdmins}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="p-4 shadow">
            <Typography variant="h6">Total Employees</Typography>
            <Typography variant="h3" color="success">
              {data.totalEmployees}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card className="p-4 shadow">
            <Typography variant="h6">Contacts</Typography>
            <Typography variant="h4">
              {data.totalContacts.used} / {data.totalContacts.remaining}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Contacts Chart */}
      <Box marginTop={4}>
        <Card className="p-6 shadow">
          <Typography variant="h6" gutterBottom>
            Contacts Usage Overview
          </Typography>
          <Bar data={contactChartData} />
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;