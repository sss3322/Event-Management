import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register the components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events.');
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const eventNames = events.map(event => event.title);
  const participants = events.map(event => event.participants);
  const ticketsSold = events.map(event => event.ticketsSold);
  const revenue = events.map(event => event.revenue);

  const barChartData = {
    labels: eventNames,
    datasets: [
      {
        label: 'Participants',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
        hoverBorderColor: 'rgba(54, 162, 235, 1)',
        data: participants,
      },
      {
        label: 'Tickets Sold',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
        hoverBorderColor: 'rgba(255, 99, 132, 1)',
        data: ticketsSold,
      },
    ],
  };

  const halfSizeStyle = {
    width: '500px',
    height: '300px',
  };

  const pieChartData = {
    labels: eventNames,
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        hoverBackgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        data: revenue,
      },
    ],
  };

  return (
    <div className="dashboard ml-20 mt-10">
      <h1 className="text-2xl font-bold mb-4">Event Dashboard</h1>
      <div className="chart-container">
        <div className="chart" style={halfSizeStyle}>
          <h2 className="text-xl font-semibold">Participants and Tickets Sold per Event</h2>
          <Bar data={barChartData} />
        </div>
        {/* <div className="chart"style={halfSizeStyle}>
          <h2 className="text-xl font-semibold">Tickets Sold per Event</h2>
          <Bar data={barChartData} />
        </div> */}
        <div className="chart"style={halfSizeStyle}>
          <h2 className="text-xl font-semibold">Revenue per Event</h2>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
