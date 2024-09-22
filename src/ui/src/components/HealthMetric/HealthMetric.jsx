import React, { useState, useEffect } from 'react';
import { getHealthMetrics, addHealthMetric } from '../../services/api';

const HealthMetric = () => {
  const [metrics, setMetrics] = useState([]);
  const [metricType, setMetricType] = useState('');
  const [value, setValue] = useState('');
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      const { data } = await getHealthMetrics();
      setMetrics(data);
    };
    fetchMetrics();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addHealthMetric(metricType, value, timestamp, 1);  // Replace 1 with the actual userId
    setMetricType('');
    setValue('');
    setTimestamp('');
    const { data } = await getHealthMetrics();
    setMetrics(data);
  };

  return (
    <div className="container mt-5">
      <h2>Log Health Metric</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Metric Type</label>
          <input type="text" className="form-control" value={metricType} onChange={(e) => setMetricType(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Value</label>
          <input type="number" className="form-control" value={value} onChange={(e) => setValue(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Timestamp</label>
          <input type="datetime-local" className="form-control" value={timestamp} onChange={(e) => setTimestamp(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Log Metric</button>
      </form>

      <h2 className="mt-5">Health Metrics</h2>
      <ul className="list-group mt-3">
        {metrics.map(metric => (
          <li key={metric.id} className="list-group-item">
            {metric.metricType} - {metric.value} at {new Date(metric.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HealthMetric;
