import { Card, Typography } from "@mui/material";
import React from "react";
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
import { useSelector } from "react-redux";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ContactUsageChart = () => {
  const { dashBoardCardsData } = useSelector((state) => state.globalData);

  const contactChartData = {
    labels: ["Used", "Remaining"],
    datasets: [
      {
        label: "Contacts",
        data: [
          dashBoardCardsData?.totalContactsUsed || 0,
          dashBoardCardsData?.totalContactsLimit -
            dashBoardCardsData?.totalContactsUsed || 0,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.2)", // Light blue for Plan 1
          "rgba(16, 185, 129, 0.2)", // Light green for Plan 2
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)", // Blue for Plan 1
          "rgba(16, 185, 129, 1)", // Green for Plan 2
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card className="p-6 shadow w-full h-[60vh]">
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
  );
};

export default ContactUsageChart;
