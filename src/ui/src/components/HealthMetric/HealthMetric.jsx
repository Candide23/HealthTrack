import React, { useState, useEffect } from 'react';
import { HealthMetricAPI } from '../../services/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const HealthMetric = ({ triggerNotificationRefresh }) => {
  const [metrics, setMetrics] = useState([]);
  const [weightLbs, setWeightLbs] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [editing, setEditing] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchMetrics();
    }
  }, [navigate, user]);

  const fetchMetrics = async () => {
    try {
      const response = await HealthMetricAPI.getAll(userId);
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      if (error.response?.status === 401) navigate('/login');
    }
  };

  // Helper function to format weight (expects pounds)
  const formatWeight = (weightValue) => {
    if (!weightValue || isNaN(weightValue)) return 'N/A';
    return `${weightValue.toFixed(1)} lbs`;
  };

  // Helper function to format height (expects total inches)
  const formatHeight = (heightValue) => {
    if (!heightValue || isNaN(heightValue)) return 'N/A';

    const totalInches = heightValue;
    if (totalInches <= 0 || totalInches > 120) return 'Invalid';

    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const timestamp = dayjs().toISOString();

    // Store weight in pounds (no conversion)
    const weightPounds = parseFloat(weightLbs);

    // Convert height to total inches for storage
    const totalInches = parseInt(heightFeet) * 12 + parseInt(heightInches);

    // Calculate BMI using pounds and inches formula: (weight in lbs / (height in inches)²) × 703
    const bmi = (weightPounds / (totalInches * totalInches)) * 703;

    try {
      if (!editing) {
        await HealthMetricAPI.create({ metricType: 'Weight', value: weightPounds, timestamp, userId });
        await HealthMetricAPI.create({ metricType: 'Height', value: totalInches, timestamp, userId });
        await HealthMetricAPI.create({ metricType: 'BMI', value: bmi, timestamp, userId });
      } else {
        await HealthMetricAPI.update(editing.weightId, { metricType: 'Weight', value: weightPounds, timestamp, userId });
        await HealthMetricAPI.update(editing.heightId, { metricType: 'Height', value: totalInches, timestamp, userId });
        await HealthMetricAPI.update(editing.bmiId, { metricType: 'BMI', value: bmi, timestamp, userId });
      }

      fetchMetrics();
      resetForm();
      if (triggerNotificationRefresh) triggerNotificationRefresh();
    } catch (error) {
      console.error('Error saving metric:', error.response?.data || error.message);
    }
  };

  const resetForm = () => {
    setWeightLbs('');
    setHeightFeet('');
    setHeightInches('');
    setEditing(null);
  };

  const handleEdit = (group) => {
    const weightValue = group['Weight']?.value;
    const heightValue = group['Height']?.value;

    if (!weightValue || !heightValue) {
      alert('Cannot edit incomplete data');
      return;
    }

    // Weight is already in pounds, height is already in total inches
    const feet = Math.floor(heightValue / 12);
    const inches = Math.round(heightValue % 12);

    setWeightLbs(weightValue.toFixed(1));
    setHeightFeet(feet);
    setHeightInches(inches);
    setEditing({
      weightId: group['Weight'].id,
      heightId: group['Height'].id,
      bmiId: group['BMI'].id,
    });
  };

  const handleDelete = async (timestamp) => {
    if (!window.confirm('Are you sure you want to delete this metric entry?')) {
      return;
    }

    try {
      const group = metrics.filter(m => m.timestamp === timestamp);
      await Promise.all(group.map(m => HealthMetricAPI.delete(m.id)));
      fetchMetrics();
    } catch (error) {
      console.error('Error deleting metrics:', error);
    }
  };

  const grouped = {};
  metrics.forEach(m => {
    if (!grouped[m.timestamp]) grouped[m.timestamp] = {};
    grouped[m.timestamp][m.metricType] = m;
  });

  // Filter out incomplete groups (missing Weight, Height, or BMI)
  const validGroupedEntries = Object.entries(grouped).filter(([timestamp, group]) => {
    const hasWeight = group['Weight']?.value && !isNaN(group['Weight'].value) && group['Weight'].value > 0;
    const hasHeight = group['Height']?.value && !isNaN(group['Height'].value) && group['Height'].value > 0;
    const hasBMI = group['BMI']?.value && !isNaN(group['BMI'].value);

    // Only show rows that have all three valid metrics
    return hasWeight && hasHeight && hasBMI;
  });

  return (
    <div>
      <form onSubmit={handleSave} className="mb-4">
        <div className="form-group">
          <label>Weight (lbs)</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            value={weightLbs}
            onChange={(e) => setWeightLbs(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Height</label>
          <div className="d-flex">
            <input
              type="number"
              className="form-control mr-2"
              placeholder="Feet"
              value={heightFeet}
              onChange={(e) => setHeightFeet(e.target.value)}
              required
            />
            <input
              type="number"
              className="form-control"
              placeholder="Inches"
              value={heightInches}
              onChange={(e) => setHeightInches(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>BMI (calculated)</label>
          <input
            type="text"
            className="form-control"
            readOnly
            value={
              weightLbs && heightFeet && heightInches
                ? (
                    (parseFloat(weightLbs) / Math.pow((parseInt(heightFeet) * 12 + parseInt(heightInches)), 2)) * 703
                  ).toFixed(2)
                : '-'
            }
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success btn-sm">
            {editing ? 'Update Metrics' : 'Add Metrics'}
          </button>
          {editing && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Weight</th>
              <th>Height</th>
              <th>BMI</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {validGroupedEntries.map(([ts, group]) => (
              <tr key={ts}>
                <td>{dayjs(ts).format('YYYY-MM-DD HH:mm')}</td>
                <td>{formatWeight(group['Weight']?.value)}</td>
                <td>{formatHeight(group['Height']?.value)}</td>
                <td>{group['BMI']?.value ? group['BMI'].value.toFixed(1) : 'N/A'}</td>
                <td>
                  <button
                                      className="btn btn-warning btn-sm mr-1"
                                      onClick={() => handleEdit(group)}
                                      title="Edit"
                                    >
                                      ✏️
                                    </button>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => handleDelete(ts)}
                                      title="Delete"
                                    >
                                      🗑️
                                    </button>
                </td>
              </tr>
            ))}
            {validGroupedEntries.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No valid health metrics found. Add your first metric above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HealthMetric;