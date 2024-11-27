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
import { Card, Typography } from "@mui/material";
import { useSelector } from "react-redux";

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
  const { usersGraphData } = useSelector((state) => state.globalData);

  // Prepare data for the chart
  const labels = usersGraphData.map((item) => item?.dateObj?.split("T")[0]);
  const dataCounts = usersGraphData.map((item) => item?.total);

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
