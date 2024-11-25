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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
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
    <Box className="px-10 pt-10 max-h-screen">
      <Box className='flex flex-col md:flex-row items-center gap-2  ' >
        <Box display="flex" gap={2} alignItems="center">
          <Typography>Start Date:</Typography>
          <DatePicker
            className="border p-2 rounded-lg"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
          />
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <Typography>End Date:</Typography>
          <DatePicker
            className="border p-2 rounded-lg"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
          />
        </Box>
        <Button variant="contained" color="primary">
          Apply
        </Button>
      </Box>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-x-8 gap-y-4 pt-3">
        <Card className="p-3 shadow">
          <Typography variant="h6">Accounts Created</Typography>
          <Typography variant="h4" color="primary">
            {data.accountsCreated}
          </Typography>
        </Card>
        <Card className="p-3 shadow">
          <Typography variant="h6">Active Accounts</Typography>
          <Typography variant="h4" color="success">
            {data.activeAccounts}
          </Typography>
        </Card>
        <Card className="p-3 shadow">
          <Typography variant="h6">Overall Revenue</Typography>
          <Typography variant="h4" color="secondary">
            {data.revenue}
          </Typography>
        </Card>
        <Card className="p-3 shadow">
          <Typography variant="h6">Total Admins</Typography>
          <Typography variant="h4" color="primary">
            {data.totalAdmins}
          </Typography>
        </Card>
        <Card className="p-3 shadow">
          <Typography variant="h6">Total Employees</Typography>
          <Typography variant="h4" color="success">
            {data.totalEmployees}
          </Typography>
        </Card>
        <Card className="p-3 shadow">
          <Typography variant="h6">Contacts</Typography>
          <Typography variant="h4">
            {data.totalContacts.used} / {data.totalContacts.remaining}
          </Typography>
        </Card>
      </div>
      {/* Contacts Chart */}
      <Box marginTop={2} className="flex justify-end">
        <Card className="p-6 shadow w-full  lg:w-1/2">
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
