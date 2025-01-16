import React, { useState, useEffect } from 'react';
import { SymptomAPI } from '../../services/api';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const Symptom = () => {
  const symptomOptions = [
    { label: 'Headache', value: 'Headache' },
    { label: 'Fatigue', value: 'Fatigue' },
    { label: 'Chest Pain', value: 'Chest Pain' },
    { label: 'Fever', value: 'Fever' },
    { label: 'Cough', value: 'Cough' },
  ];

  const [symptoms, setSymptoms] = useState([]);
  const [symptomType, setSymptomType] = useState(symptomOptions[0].value);
  const [severity, setSeverity] = useState(1);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Fetch user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.id;

  useEffect(() => {
    if (!user || !localStorage.getItem('token'))  {
      navigate('/login'); // Redirect if not logged in
    } else {
      fetchSymptoms(); // Fetch symptoms if logged in
    }
  }, [navigate, user]);

  const fetchSymptoms = async () => {
    try {
      const response = await SymptomAPI.getAll(userId);
      setSymptoms(response.data);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      if (error.response?.status === 401) {
        navigate('/login'); // Redirect to login if unauthorized
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const symptomData = {
      symptomType,
      severity,
      description,
      timestamp: dayjs().toISOString(),
      userId: user.id, // Ensure userId is included in the payload
    };

    try {
      if (editingId) {
        await SymptomAPI.update(editingId, symptomData);
      } else {
        await SymptomAPI.create(symptomData);
      }
      fetchSymptoms(); // Refresh the symptoms list
      resetForm();
    } catch (error) {
      console.error('Error saving symptom:', error.response?.data || error.message);
    }
  };

  const resetForm = () => {
    setSymptomType(symptomOptions[0].value);
    setSeverity(1);
    setDescription('');
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      await SymptomAPI.delete(id);
      fetchSymptoms();
    } catch (error) {
      console.error('Error deleting symptom:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSave} className="mb-4">
        <div className="form-group">
          <label>Symptom Type</label>
          <select
            className="form-control"
            value={symptomType}
            onChange={(e) => setSymptomType(e.target.value)}
            required
          >
            {symptomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Severity (1-10)</label>
          <input
            type="number"
            className="form-control"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            min="1"
            max="10"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success btn-sm">
          {editingId ? 'Update Symptom' : 'Add Symptom'}
        </button>
      </form>

      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th>Type</th>
              <th>Severity</th>
              <th>Description</th>
              <th>Timestamp</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {symptoms.map((symptom) => (
              <tr key={symptom.id}>
                <td>{symptom.symptomType}</td>
                <td>{symptom.severity}</td>
                <td>{symptom.description}</td>
                <td>{dayjs(symptom.timestamp).format('YYYY-MM-DD HH:mm')}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm mr-2"
                    onClick={() => {
                      setSymptomType(symptom.symptomType);
                      setSeverity(symptom.severity);
                      setDescription(symptom.description);
                      setEditingId(symptom.id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(symptom.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Symptom;


   









