import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import moment from "moment"; // For date formatting
import { Card, Typography } from "@mui/material";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const UserGrowthByDate = () => {
  // Dummy data: User sign-ups with specific dates
  const userSignUpData = [
    { date: "2024-08-01", count: 5 },
    { date: "2024-08-02", count: 8 },
    { date: "2024-08-03", count: 12 },
    { date: "2024-08-04", count: 20 },
    { date: "2024-08-05", count: 15 },
    { date: "2024-08-06", count: 25 },
    { date: "2024-09-01", count: 5 },
    { date: "2024-09-02", count: 8 },
    { date: "2024-09-03", count: 12 },
    { date: "2024-09-04", count: 20 },
    { date: "2024-09-05", count: 15 },
    { date: "2024-09-06", count: 25 },
    { date: "2024-10-01", count: 5 },
    { date: "2024-10-02", count: 8 },
    { date: "2024-10-03", count: 12 },
    { date: "2024-10-04", count: 20 },
    { date: "2024-10-05", count: 15 },
    { date: "2024-10-06", count: 25 },
    { date: "2024-11-01", count: 5 },
    { date: "2024-11-02", count: 8 },
    { date: "2024-11-03", count: 12 },
    { date: "2024-11-04", count: 20 },
    { date: "2024-11-05", count: 15 },
    { date: "2024-11-06", count: 25 },
  ];

  // Prepare data for the chart
  const labels = userSignUpData.map((item) =>
    moment(item.date).format("YYYY-MM-DD")
  ); // Format dates for X-axis
  const dataCounts = userSignUpData.map((item) => item.count); // Y-axis values (sign-ups)

  const data = {
    labels, // X-axis (dates)
    datasets: [
      {
        label: "User Sign-ups",
        data: dataCounts, // Y-axis (sign-up counts)
        fill: true, // Fill the area under the line
        backgroundColor: "rgba(54, 162, 235, 0.2)", // Area fill color
        borderColor: "rgba(54, 162, 235, 1)", // Line color
        borderWidth: 2, // Line thickness
        pointBackgroundColor: "rgba(54, 162, 235, 1)", // Point color
        pointBorderColor: "#fff", // Point border color
        tension: 0.4, // Smooth the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "User Growth By Date", // Chart title
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`; // Tooltip content
          },
        },
      },
      legend: {
        display: true, // Show legend
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dates", // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: "Sign-ups", // Y-axis title
        },
        beginAtZero: true, // Start Y-axis at 0
      },
    },
    layout: {
        padding: {
          bottom: 30, // Add padding to the bottom to make space for labels
        },
      },
  };

  return (
    <Card className="p-6 shadow w-full  h-[60vh] ">
      <Typography variant="h6" gutterBottom>
        User Growth Overview
      </Typography>
      <Line data={data} options={options} />
    </Card>
  );
};

export default UserGrowthByDate;
