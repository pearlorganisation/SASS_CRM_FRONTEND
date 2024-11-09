// Import necessary components and modules
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define the data for the pie chart


// Define the component
export default function PieChart({pieData}) {

    const data = {
        labels: ['Sales', 'Reminder'],
        datasets: [
          {
            label: 'Total Employees',
            data: pieData,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
            ],
            hoverOffset: 4,
          },
        ],
      };

  return (
    <div className='w-96'>
      <Pie data={data} />
    </div>
  );
}
