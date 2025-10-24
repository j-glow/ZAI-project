import React, { useMemo } from 'react';
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
    const timestampKey = m.timestamp;

    if (!dataMap.has(timestampKey)) {
      dataMap.set(timestampKey, { timestamp: m.timestamp });
    }

    dataMap.get(timestampKey)[m.series.name] = m.value;
  });

  return Array.from(dataMap.values()).sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );
};

const formatXAxis = (isoString) => {
  return new Date(isoString).toLocaleString('default', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const MeasurementChart = ({ measurements, seriesList, highlightedPoint }) => {
  const chartData = formatDataForChart(measurements);

  const formattedTimestamp = highlightedPoint
    ? new Date(highlightedPoint).toLocaleString()
    : null;

  const activeIndex = useMemo(() =>
    formattedTimestamp
      ? chartData.findIndex(d => d.timestamp === formattedTimestamp)
      : -1,
    [chartData, formattedTimestamp]
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        activeTooltipIndex={activeIndex === -1 ? undefined : activeIndex}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" tickFormatter={formatXAxis} />
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
