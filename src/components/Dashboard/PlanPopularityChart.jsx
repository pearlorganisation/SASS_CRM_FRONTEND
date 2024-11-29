import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Card, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardPlansData } from "../../features/actions/globalData";

// Register the necessary Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const PlanPopularityChart = () => {
  // Dummy data for the plans and their respective subscription counts
  const { plansGraphData = [] } = useSelector((state) => state.globalData);

  const data = {
    labels: plansGraphData.map((plan) => plan?.plan?.name || "-"), // Plan names
    datasets: [
      {
        label: "Number of Subscriptions",
        data: plansGraphData.map((plan) => plan?.total || 0), // Subscription counts for each plan
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)", // Color for Basic Plan
          "rgba(54, 162, 235, 0.2)", // Color for Standard Plan
          "rgba(255, 206, 86, 0.2)", // Color for Premium Plan
          "rgba(75, 192, 192, 0.2)", // Color for Enterprise Plan
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // Border color for Basic Plan
          "rgba(54, 162, 235, 1)", // Border color for Standard Plan
          "rgba(255, 206, 86, 1)", // Border color for Premium Plan
          "rgba(75, 192, 192, 1)", // Border color for Enterprise Plan
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Plan Popularity", // Title of the chart
      },
      legend: {
        display: true,
        position: "top", // Position the legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`; // Customize the tooltip label to show subscriptions
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Plans", // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: "Subscriptions", // Y-axis title
        },
        beginAtZero: true, // Start Y-axis from 0
      },
    },
    layout: {
      padding: {
        bottom: 30, // Add padding to the bottom to make space for labels
      },
    },
  };

  return (
    <Card className="p-6 shadow w-full h-[60vh] ">
      <Typography variant="h6" gutterBottom>
        Plan Popularity Overview
      </Typography>
      <Bar data={data} options={options} />
    </Card>
  );
};

export default PlanPopularityChart;
