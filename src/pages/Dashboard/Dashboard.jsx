import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Grid,
  Box,
  Button,
  Divider,
  TextField,
  Modal,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bar } from "react-chartjs-2";
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
import MetricCard from "../../components/Dashboard/MetricCard";
import PlanPopularityChart from "../../components/Dashboard/PlanPopularityChart";
import UserGrowthByDate from "../../components/Dashboard/UserGrowthByDate";
import RevenueByDateChart from "../../components/Dashboard/RevenueByDateChart";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardData } from "../../features/actions/globalData";

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
  const dispatch = useDispatch();
  const { dashBoardCardsData } = useSelector((state) => state.globalData);
  console.log("dashboardData", dashBoardCardsData);
  const cardData = [
    {
      label: "Accounts Created",
      value: dashBoardCardsData?.accountsCreated || 0,
      color: "primary",
    },
    {
      label: "Active Accounts",
      value: dashBoardCardsData?.activeAccounts || 0,
      color: "success",
    },
    {
      label: "Overall Revenue",
      value: dashBoardCardsData?.totalRevenue || 0,
      color: "secondary",
    },
    {
      label: "Total Admins",
      value: dashBoardCardsData?.totalAdmins || 0,
      color: "primary",
    },
    {
      label: "Total Employees",
      value: dashBoardCardsData?.totalEmployees || 0,
      color: "success",
    },
    {
      label: "Contacts",
      value: `${dashBoardCardsData?.totalContactsUsed || 0} / ${
        dashBoardCardsData?.totalContactsLimit || 0
      }`,
      color: "textPrimary",
    },
  ];

  const contactChartData = {
    labels: ["Used", "Remaining"],
    datasets: [
      {
        label: "Contacts",
        data: [dashBoardCardsData?.totalContactsUsed || 0, dashBoardCardsData?.totalContactsLimit - dashBoardCardsData?.totalContactsUsed || 0],
        backgroundColor: ["#3b82f6", "#10b981"],
      },
    ],
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [visibleCards, setVisibleCards] = useState([
    "Accounts Created",
    "Active Accounts",
    "Overall Revenue",
    "Total Admins",
    "Total Employees",
    "Contacts",
  ]);

  // Dummy data

  const handleToggleModal = () => setModalOpen(!modalOpen);

  const handleCardSelection = (label) => {
    setVisibleCards(
      (prev) =>
        prev.includes(label)
          ? prev.filter((item) => item !== label) // Remove if already selected
          : [...prev, label] // Add if not selected
    );
  };

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getDashboardData({ startDate, endDate }));
    }
  }, [startDate, endDate]);
  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7); // Subtract 7 days from today's date

    setStartDate(oneWeekAgo);
    setEndDate(today);
  }, []);

  return (
    <Box className="md:px-10 py-10">
      <Box className="flex justify-between">
        {/* Date Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4  ">
          <Box display="flex" gap={2} alignItems="center">
            <Typography>Start Date:</Typography>
            <DatePicker
              className="border p-2 rounded-lg w-28"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <Typography>End Date:</Typography>
            <DatePicker
              className="border p-2 rounded-lg w-28"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </Box>
        </div>
        {/* Filter Button */}
        <Button
          className="h-fit"
          variant="outlined"
          color="secondary"
          onClick={handleToggleModal}
        >
          Filter Cards
        </Button>
      </Box>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-x-8 gap-y-4 pt-3">
        {cardData
          .filter((item) => visibleCards.includes(item.label)) // Filter visible cards
          .map((item, index) => (
            <MetricCard key={index} {...item} />
          ))}
      </div>
      {/* Contacts Chart */}
      <Box
        marginTop={2}
        className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 "
      >
        <PlanPopularityChart />
        <Card className="p-6 shadow w-full  h-[60vh] ">
          <Typography variant="h6" gutterBottom>
            Contacts Usage Overview
          </Typography>

          <Bar
            data={contactChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  bottom: 30, // Add padding to the bottom to make space for labels
                },
              },
            }}
          />
        </Card>
        <UserGrowthByDate />
        <RevenueByDateChart />
      </Box>
      {/* Modal for Card Selection */}
      <Modal open={modalOpen} onClose={handleToggleModal}>
        <Box
          className="bg-white rounded-lg shadow-lg p-6"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Select Cards to Display
          </Typography>
          <Divider />
          <div className="pt-3 grid grid-cols-2">
            {cardData.map((item, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={visibleCards.includes(item.label)}
                    onChange={() => handleCardSelection(item.label)}
                  />
                }
                label={item.label}
              />
            ))}
          </div>
          <Box className="flex justify-end gap-3 pt-4">
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleToggleModal}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleToggleModal}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
