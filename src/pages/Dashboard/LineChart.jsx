import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({webinarData}) => {
  const rawData = [
    {
      date: "2024-10-22",
      count: 33
    },
    {
      date: "2024-10-19",
      count: 325
    },
    {
      date: "2024-10-16",
      count: 200
    },
    {
      date: "2024-10-08",
      count: 250
    },
    {
      date: "2024-10-01",
      count: 200
    },
    {
      date: "2024-09-08",
      count: 250
    }
  ];

  // Sort data by date
  const sortedData = [...webinarData].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Format dates
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const data = {
    labels: sortedData.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Total Participants',
        data: sortedData.map(item => item.count),
        borderColor: '#2563eb',
        backgroundColor: '#2563eb',
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Webinar Participants Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          drawBorder: false,
        },
        title: {
          display: true,
          text: 'Total Participants',
        },
      },
      x: {
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Webinar Date',
        },
      },
    },
  };

  return (
    <div className="w-96 h-96">
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;