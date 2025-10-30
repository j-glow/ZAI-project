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
  ReferenceDot,
} from 'recharts';

const formatDataForChart = (measurements, seriesList) => {
  if (!measurements.length || !seriesList.length) {
    return [];
  }

  const dataMap = new Map();

  // Single pass through measurements to build the data map
  measurements.forEach((m) => {
    if (m.series && m.series.id) {
      const timestamp = new Date(m.timestamp).getTime();
      if (!dataMap.has(timestamp)) {
        dataMap.set(timestamp, { timestamp });
      }
      const entry = dataMap.get(timestamp);
      entry[m.series.id] = parseFloat(m.value);
    }
  });

  // Get the data points and sort them by timestamp
  const sortedData = Array.from(dataMap.values()).sort(
    (a, b) => a.timestamp - b.timestamp
  );

  return sortedData;
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

const MeasurementChart = ({ measurements, seriesList, highlightedPoint, isPrinting, chartDimensions }) => {
  const chartData = useMemo(
    () => formatDataForChart(measurements, seriesList),
    [measurements, seriesList]
  );

  const tickFormatter = useMemo(() => {
    if (chartData.length === 0) {
      return (unixTime) => new Date(unixTime).toLocaleDateString();
    }

    const minTimestamp = chartData[0].timestamp;
    const maxTimestamp = chartData[chartData.length - 1].timestamp;
    const timeRange = maxTimestamp - minTimestamp;

    const oneAndAHalfDaysInMillis = 1.5 * 24 * 60 * 60 * 1000;

    if (timeRange < oneAndAHalfDaysInMillis) {
      return (unixTime) => new Date(unixTime).toLocaleTimeString('default', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return (unixTime) => new Date(unixTime).toLocaleDateString('default', {
        month: 'short',
        day: 'numeric',
      });
    }
  }, [chartData]);

  const highlightedDataPoint = useMemo(() => {
    if (!highlightedPoint) return null;
    const highlightedTimestamp = new Date(highlightedPoint).getTime();
    return chartData.find(d => d.timestamp === highlightedTimestamp);
  }, [chartData, highlightedPoint]);

  const yValueForDot = useMemo(() => {
    if (!highlightedDataPoint) return null;

    for (const series of seriesList) {
      if (highlightedDataPoint[series.id] !== undefined) {
        return highlightedDataPoint[series.id];
      }
    }
    return null;
  }, [highlightedDataPoint, seriesList]);

  const chart = (
    <LineChart
      width={isPrinting ? chartDimensions.width : undefined}
      height={isPrinting ? chartDimensions.height : undefined}
      data={chartData}
      margin={{
        top: 5,
        right: 40,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        type="number"
        dataKey="timestamp"
        domain={['dataMin', 'dataMax']}
        tickFormatter={tickFormatter}
        allowDuplicatedCategory={false}
      />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />

      {useMemo(() => seriesList.map((series) => (
        <Line
          key={series.id}
          type="monotone"
          dataKey={series.id}
          name={series.name}
          stroke={series.color}
          activeDot={{ r: 8 }}
          connectNulls
          isAnimationActive={!isPrinting}
        />
      )), [seriesList, isPrinting])}

      {highlightedDataPoint && yValueForDot !== null && (
        <ReferenceDot
          x={highlightedDataPoint.timestamp}
          y={yValueForDot}
          r={8}
          fill="red"
          stroke="white"
          isFront
        />
      )}
    </LineChart>
  );

  if (isPrinting) {
    return chart;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      {chart}
    </ResponsiveContainer>
  );
};

export default React.memo(MeasurementChart);
