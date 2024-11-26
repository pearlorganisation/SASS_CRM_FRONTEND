import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import moment from 'moment';
import { Card, Typography } from '@mui/material';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

const RevenueByDateChart = () => {
  // Dummy revenue data for 30 days
  const revenueData = Array.from({ length: 30 }, (_, i) => ({
    date: moment('2024-11-01').add(i, 'days').format('YYYY-MM-DD'),
    revenue: Math.floor(Math.random() * 1000) + 100, // Random revenue values between 100 and 1000
  }));

  // Extract labels (dates) and data (revenue) for the chart
  const labels = revenueData.map((item) => item.date);
  const revenues = revenueData.map((item) => item.revenue);

  const data = {
    labels, // Dates for X-axis
    datasets: [
      {
        label: 'Revenue',
        data: revenues, // Revenue values
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        pointBorderColor: '#fff',
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
        text: 'Revenue Over Time', // Title of the chart
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: $${context.raw.toLocaleString()}`; // Tooltip formatting
          },
        },
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Dates',
        },
        ticks: {
          autoSkip: true, // Automatically skip ticks if too many dates
          maxTicksLimit: 10, // Limit the number of X-axis labels shown
        },
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (in $)',
        },
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `$${value.toLocaleString()}`; // Format Y-axis labels as currency
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
