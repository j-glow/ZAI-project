import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const formatDataForChart = (measurements) => {
  const dataMap = new Map();

  measurements.forEach((m) => {
    const timestamp = new Date(m.timestamp).toLocaleString();

    if (!dataMap.has(timestamp)) {
      dataMap.set(timestamp, { timestamp });
    }

    dataMap.get(timestamp)[m.series.name] = m.value;
  });

  return Array.from(dataMap.values()).sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
};

const MeasurementChart = ({ measurements, seriesList }) => {
  const chartData = formatDataForChart(measurements);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />

        {seriesList.map((series) => (
          <Line
            key={series._id}
            type="monotone"
            dataKey={series.name}
            stroke={series.color}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MeasurementChart;
