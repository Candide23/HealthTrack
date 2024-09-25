import React, { useState, useEffect } from 'react';
import { HealthMetricAPI } from '../../services/api';
import dayjs from 'dayjs';

const HealthMetric = () => {
  const metricOptions = [
    { label: 'Weight (lbs)', value: 'Weight' },
    { label: 'Height (ft/in)', value: 'Height' },
    { label: 'Blood Pressure (mmHg)', value: 'Blood Pressure' },
    { label: 'Heart Rate (bpm)', value: 'Heart Rate' },
    { label: 'Blood Sugar (mg/dL)', value: 'Blood Sugar' },
    { label: 'Cholesterol (mg/dL)', value: 'Cholesterol' },
    { label: 'BMI', value: 'BMI' },
    { label: 'Body Temperature (°F)', value: 'Body Temperature' },
    { label: 'Respiratory Rate (breaths per minute)', value: 'Respiratory Rate' },
    { label: 'Oxygen Saturation (SpO2 %)', value: 'Oxygen Saturation' }
  ];

  const [metrics, setMetrics] = useState([]);
  const [metricType, setMetricType] = useState(metricOptions[0].value);
  const [value, setValue] = useState('');
  const [editingId, setEditingId] = useState(null);

  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    fetchMetrics();

  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await HealthMetricAPI.getAll(userId);
            setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const timestamp = dayjs().toISOString();

    if (!userId) {
      console.error('User ID not found in localStorage.');
      return;
    }

    const metricData = {
      metricType,
      value: parseFloat(value), 
      timestamp,
      userId 
    };

    try {
      if (editingId) {
        await HealthMetricAPI.update(editingId, metricData);
      } else {
        await HealthMetricAPI.create(metricData);
      }
      fetchMetrics(); 
      resetForm(); 
    } catch (error) {
      console.error('Error saving metric:', error.response ? error.response.data : error.message);
    }
  };

  const resetForm = () => {
    setMetricType(metricOptions[0].value);
    setValue('');
    setEditingId(null);
  };

  return (
    <div>
      <form onSubmit={handleSave} className="mb-4">
        <div className="form-group">
          <label>Metric Type</label>
          <select
            className="form-control"
            value={metricType}
            onChange={(e) => setMetricType(e.target.value)}
            required
          >
            {metricOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Value</label>
          <input
            type="number"
            className="form-control"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success btn-sm">
          {editingId ? 'Update Metric' : 'Add Metric'}
        </button>
      </form>

      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>Type</th>
            <th>Value</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.id}>
              <td>{metric.metricType}</td>
              <td>{metric.value}</td>
              <td>{dayjs(metric.timestamp).format('YYYY-MM-DD HH:mm')}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm mr-2"
                  onClick={() => {
                    setMetricType(metric.metricType);
                    setValue(metric.value);
                    setEditingId(metric.id);
                  }}
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => HealthMetricAPI.delete(metric.id).then(fetchMetrics)}
                >
                  <i className="fas fa-trash-alt"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HealthMetric;









