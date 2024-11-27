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
import moment from "moment";
import { Card, Typography } from "@mui/material";
import { useSelector } from "react-redux";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const RevenueByDateChart = () => {
  // Dummy revenue data for 30 days
  const { revenueGraphData } = useSelector((state) => state.globalData);

  // Extract labels (dates) and data (revenue) for the chart
  const labels = revenueGraphData.map((item) => item?.dateObj?.split("T")[0]);
  const revenues = revenueGraphData.map((item) => item?.totalRevenue);

  const data = {
    labels, // Dates for X-axis
    datasets: [
      {
        label: "Revenue",
        data: revenues, // Revenue values
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        tension: 0.4, // Smooth line curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Revenue Over Time", // Title of the chart
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: \u20B9${context.raw.toLocaleString()}`; // Tooltip formatting
          },
        },
      },
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dates",
        },
        ticks: {
          autoSkip: true, // Automatically skip ticks if too many dates
          maxTicksLimit: 10, // Limit the number of X-axis labels shown
        },
      },
      y: {
        title: {
          display: true,
          text: "Revenue (in \u20B9)",
        },
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `\u20B9${value.toLocaleString()}`; // Format Y-axis labels as currency
          },
        },
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
        Revenue Overview
      </Typography>
      <Line data={data} options={options} />
    </Card>
  );
};

export default RevenueByDateChart;
