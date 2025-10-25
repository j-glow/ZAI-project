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

const formatDataForChart = (measurements, seriesList) => {
  if (!measurements.length || !seriesList.length) {
    return [];
  }

  const dataMap = new Map();
  const allTimestamps = new Set();

  measurements.forEach((m) => {
    allTimestamps.add(m.timestamp);
  });

  const sortedTimestamps = Array.from(allTimestamps).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  sortedTimestamps.forEach((timestamp) => {
    dataMap.set(timestamp, { timestamp: new Date(timestamp).getTime() });
  });

  measurements.forEach((m) => {
    if (m.series && m.series._id) {
      const entry = dataMap.get(m.timestamp);
      if (entry) {
        entry[m.series._id] = m.value;
      }
    }
  });

  return Array.from(dataMap.values());
};

const formatXAxis = (unixTime) => {
  return new Date(unixTime).toLocaleString('default', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`Time : ${formatXAxis(label)}`}</p>
        {payload.map((pld, index) => (
          <p key={index} style={{ color: pld.color }}>{`${pld.name} : ${pld.value}`}</p>
        ))}
      </div>
    );
  }

  return null;
};

const MeasurementChart = ({ measurements, seriesList, highlightedPoint }) => {
  const chartData = useMemo(
    () => formatDataForChart(measurements, seriesList),
    [measurements, seriesList]
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
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="timestamp"
          domain={['dataMin', 'dataMax']}
          tickFormatter={formatXAxis}
          allowDuplicatedCategory={false}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />

        {seriesList.map((series) => (
          <Line
            key={series._id}
            type="monotone"
            dataKey={series._id}
            name={series.name}
            stroke={series.color}
            activeDot={{ r: 8 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MeasurementChart;
