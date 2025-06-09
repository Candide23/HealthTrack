import React, { useState, useEffect } from 'react';
import { SymptomAPI } from '../../services/api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'; // Add this import
import { useNavigate } from 'react-router-dom';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

const Symptom = () => {
  const symptomOptions = [
    { label: 'Headache', value: 'Headache', icon: '🤕', critical: false },
    { label: 'Fatigue', value: 'Fatigue', icon: '😴', critical: false },
    { label: 'Chest Pain', value: 'Chest Pain', icon: '💔', critical: true },
    { label: 'Fever', value: 'Fever', icon: '🤒', critical: false },
    { label: 'Cough', value: 'Cough', icon: '😷', critical: false },
    { label: 'Severe Headache', value: 'Severe Headache', icon: '🤯', critical: true },
    { label: 'Difficulty Breathing', value: 'Difficulty Breathing', icon: '😤', critical: true },
    { label: 'Sudden Vision Loss', value: 'Sudden Vision Loss', icon: '👁️', critical: true },
    { label: 'Severe Abdominal Pain', value: 'Severe Abdominal Pain', icon: '🤮', critical: true },
    { label: 'Numbness', value: 'Numbness', icon: '🫸', critical: true },
    { label: 'Confusion', value: 'Confusion', icon: '😵', critical: true },
    { label: 'Nausea', value: 'Nausea', icon: '🤢', critical: false },
    { label: 'Muscle Pain', value: 'Muscle Pain', icon: '💪', critical: false },
    { label: 'Dizziness', value: 'Dizziness', icon: '😵‍💫', critical: false },
    { label: 'Joint Pain', value: 'Joint Pain', icon: '🦴', critical: false }
  ];

  const [symptoms, setSymptoms] = useState([]);
  const [symptomType, setSymptomType] = useState(symptomOptions[0].value);
  const [severity, setSeverity] = useState(1);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showCriticalWarning, setShowCriticalWarning] = useState(false);
  const [showSeverityWarning, setShowSeverityWarning] = useState(false);
  const [recentPatterns, setRecentPatterns] = useState({});
  const navigate = useNavigate();

  // Fetch user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (!user || !localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchSymptoms();
    }
  }, [navigate, user]);

  useEffect(() => {
    // Check for critical symptom selection
    const selectedSymptom = symptomOptions.find(opt => opt.value === symptomType);
    setShowCriticalWarning(selectedSymptom?.critical || false);
  }, [symptomType]);

  useEffect(() => {
    // Check for high severity warning
    setShowSeverityWarning(severity >= 7);
  }, [severity]);

  useEffect(() => {
    // Analyze recent symptom patterns
    if (symptoms.length > 0) {
      analyzeSymptomPatterns();
    }
  }, [symptoms]);

  const fetchSymptoms = async () => {
    try {
      const response = await SymptomAPI.getAll(userId);
      setSymptoms(response.data || []);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const analyzeSymptomPatterns = () => {
    const oneWeekAgo = dayjs().subtract(7, 'days');
    const recentSymptoms = symptoms.filter(s => dayjs(s.timestamp).isAfter(oneWeekAgo));

    // Group by symptom type
    const patterns = {};
    recentSymptoms.forEach(symptom => {
      if (!patterns[symptom.symptomType]) {
        patterns[symptom.symptomType] = [];
      }
      patterns[symptom.symptomType].push(symptom);
    });

    // Filter patterns with 2+ occurrences
    const significantPatterns = {};
    Object.keys(patterns).forEach(type => {
      if (patterns[type].length >= 2) {
        const lastOccurrence = Math.max(...patterns[type].map(s => new Date(s.timestamp)));
        significantPatterns[type] = {
          count: patterns[type].length,
          avgSeverity: patterns[type].reduce((sum, s) => sum + s.severity, 0) / patterns[type].length,
          lastOccurrence: getTimeAgo(lastOccurrence) // Use custom function instead of fromNow
        };
      }
    });

    setRecentPatterns(significantPatterns);
  };

  // Custom time ago function
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return `${Math.floor(diffInMinutes / 10080)}w ago`;
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Show confirmation for critical symptoms or high severity
    if ((showCriticalWarning || showSeverityWarning) && !editingId) {
      const confirmMessage = showCriticalWarning
        ? `⚠️ You're logging "${symptomType}" which can be serious. Are you sure you want to continue?`
        : `⚠️ You're logging severity ${severity}/10 which is quite high. Are you sure you want to continue?`;

      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    const symptomData = {
      symptomType,
      severity: parseInt(severity),
      description: description.trim(),
      timestamp: dayjs().toISOString(),
      userId: user.id,
    };

    try {
      if (editingId) {
        await SymptomAPI.update(editingId, symptomData);
        showSuccessMessage('Symptom updated successfully! 📝');
      } else {
        await SymptomAPI.create(symptomData);
        showSuccessMessage('Symptom logged successfully! 📊');

        // Show additional messages based on severity or type
        if (showCriticalWarning) {
          setTimeout(() => {
            alert('🚨 Critical symptom logged. Please consider seeking immediate medical attention if symptoms worsen.');
          }, 1000);
        } else if (showSeverityWarning) {
          setTimeout(() => {
            alert('⚠️ High severity symptom logged. Please monitor closely and consider contacting a healthcare provider.');
          }, 1000);
        }
      }

      fetchSymptoms();
      resetForm();
    } catch (error) {
      console.error('Error saving symptom:', error.response?.data || error.message);
      alert('❌ Error saving symptom. Please try again.');
    }
  };

  const showSuccessMessage = (message) => {
    // Create a temporary success notification
    const successDiv = document.createElement('div');
    successDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 5px;
        border: 1px solid #c3e6cb;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      ">
        ${message}
      </div>
    `;

    document.body.appendChild(successDiv);
    setTimeout(() => {
      document.body.removeChild(successDiv);
    }, 3000);
  };

  const resetForm = () => {
    setSymptomType(symptomOptions[0].value);
    setSeverity(1);
    setDescription('');
    setEditingId(null);
    setShowCriticalWarning(false);
    setShowSeverityWarning(false);
  };

  const handleEdit = (symptom) => {
    setSymptomType(symptom.symptomType);
    setSeverity(symptom.severity);
    setDescription(symptom.description);
    setEditingId(symptom.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this symptom?')) {
      return;
    }

    try {
      await SymptomAPI.delete(id);
      fetchSymptoms();
      showSuccessMessage('Symptom deleted successfully! 🗑️');
    } catch (error) {
      console.error('Error deleting symptom:', error.response?.data || error.message);
      alert('❌ Error deleting symptom. Please try again.');
    }
  };

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'danger';
    if (severity >= 6) return 'warning';
    if (severity >= 4) return 'info';
    return 'success';
  };

  const getSeverityLabel = (severity) => {
    if (severity >= 9) return 'Critical';
    if (severity >= 7) return 'Severe';
    if (severity >= 5) return 'Moderate';
    if (severity >= 3) return 'Mild';
    return 'Minimal';
  };

  const getSymptomIcon = (symptomType) => {
    const option = symptomOptions.find(opt => opt.value === symptomType);
    return option?.icon || '📝';
  };

  const formatTimestamp = (timestamp) => {
    const now = dayjs();
    const symptomTime = dayjs(timestamp);

    if (now.diff(symptomTime, 'hours') < 24) {
      return symptomTime.fromNow();
    }
    return symptomTime.format('MMM DD, YYYY HH:mm');
  };

  return (
    <div>
      {/* Pattern Alerts */}
      {Object.keys(recentPatterns).length > 0 && (
        <div className="alert alert-info mb-4">
          <h6>📊 Recent Symptom Patterns (Last 7 days):</h6>
          {Object.entries(recentPatterns).map(([type, data]) => (
            <small key={type} className="d-block">
              • <strong>{type}</strong>: {data.count} occurrences, avg severity {data.avgSeverity.toFixed(1)}/10, last: {data.lastOccurrence}
            </small>
          ))}
          <small className="text-muted">Consider discussing recurring patterns with your healthcare provider.</small>
        </div>
      )}

      <form onSubmit={handleSave} className="mb-4">
        <div className="form-group">
          <label>Symptom Type</label>
          <select
            className={`form-control ${showCriticalWarning ? 'border-danger' : ''}`}
            value={symptomType}
            onChange={(e) => setSymptomType(e.target.value)}
            required
          >
            {symptomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label} {option.critical ? '⚠️' : ''}
              </option>
            ))}
          </select>
          {showCriticalWarning && (
            <small className="text-danger">
              ⚠️ This is a critical symptom that may require immediate medical attention.
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Severity (1-10)</label>
          <input
            type="range"
            className={`form-control-range ${showSeverityWarning ? 'border-warning' : ''}`}
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            min="1"
            max="10"
            required
          />
          <div className="d-flex justify-content-between small text-muted">
            <span>1 (Minimal)</span>
            <span className={`font-weight-bold text-${getSeverityColor(severity)}`}>
              {severity}/10 - {getSeverityLabel(severity)}
            </span>
            <span>10 (Critical)</span>
          </div>
          {showSeverityWarning && (
            <small className="text-warning">
              ⚠️ High severity rating. Please consider seeking medical advice.
            </small>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Describe your symptom in detail (location, duration, triggers, etc.)"
            required
          />
          <small className="text-muted">
            Include details like location, duration, what makes it better/worse, and any associated symptoms.
          </small>
        </div>

        <div className="form-group">
          <button
            type="submit"
            className={`btn btn-sm mr-2 ${
              showCriticalWarning ? 'btn-danger' :
              showSeverityWarning ? 'btn-warning' :
              'btn-success'
            }`}
          >
            {getSymptomIcon(symptomType)} {editingId ? 'Update Symptom' : 'Log Symptom'}
          </button>
          {editingId && (
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
              <th>Symptom</th>
              <th>Severity</th>
              <th>Description</th>
              <th>When</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {symptoms.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No symptoms logged yet. Start tracking your health!
                </td>
              </tr>
            ) : (
              symptoms.map((symptom) => (
                <tr key={symptom.id}>
                  <td>
                    <span className="mr-2">{getSymptomIcon(symptom.symptomType)}</span>
                    {symptom.symptomType}
                    {symptomOptions.find(opt => opt.value === symptom.symptomType)?.critical && (
                      <span className="badge badge-danger badge-sm ml-2">Critical</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${getSeverityColor(symptom.severity)}`}>
                      {symptom.severity}/10
                    </span>
                    <br />
                    <small className="text-muted">{getSeverityLabel(symptom.severity)}</small>
                  </td>
                  <td>
                    <div style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                      {symptom.description}
                    </div>
                  </td>
                  <td>
                    <small>{formatTimestamp(symptom.timestamp)}</small>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mr-1"
                      onClick={() => handleEdit(symptom)}
                      title="Edit symptom"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(symptom.id)}
                      title="Delete symptom"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Wellness Tips */}
      {symptoms.length > 0 && (
        <div className="mt-4 p-3 bg-light rounded">
          <h6>💡 Wellness Tips:</h6>
          <ul className="mb-0 small">
            <li>Keep a detailed symptom diary to help identify patterns and triggers</li>
            <li>Stay hydrated and get adequate rest to support your body's healing</li>
            <li>Don't hesitate to contact a healthcare provider if symptoms worsen or concern you</li>
            <li>Consider lifestyle factors like stress, diet, and sleep that might affect your symptoms</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Symptom;


   









