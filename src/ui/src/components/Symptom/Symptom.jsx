import React, { useState, useEffect } from 'react';
import { SymptomAPI } from '../../services/api';
import dayjs from 'dayjs';

const Symptom = () => {
  const symptomOptions = [
    { label: 'Headache', value: 'Headache' },
    { label: 'Fatigue', value: 'Fatigue' },
    { label: 'Chest Pain', value: 'Chest Pain' },
    { label: 'Fever', value: 'Fever' },
    { label: 'Cough', value: 'Cough' }
  ];

  const [symptoms, setSymptoms] = useState([]);
  const [symptomType, setSymptomType] = useState(symptomOptions[0].value);
  const [severity, setSeverity] = useState(1);
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);

  const userId = localStorage.getItem('userId');  // Fetch the logged-in user ID

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const fetchSymptoms = async () => {
    try {
      const response = await SymptomAPI.getAll();
      setSymptoms(response.data);
    } catch (error) {
      console.error('Error fetching symptoms:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const timestamp = dayjs().toISOString();
    const symptomData = {
      symptomType,
      severity,
      description,
      timestamp,
      userId: userId  // Pass user ID
    };

    try {
      if (editingId) {
        await SymptomAPI.update(editingId, symptomData);
      } else {
        await SymptomAPI.create(symptomData);
      }
      fetchSymptoms();
      resetForm();
    } catch (error) {
      console.error('Error saving symptom:', error.response ? error.response.data : error.message);
    }
  };

  const resetForm = () => {
    setSymptomType(symptomOptions[0].value);
    setSeverity(1);
    setDescription('');
    setEditingId(null);
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

      {/* Adjusted table for a smaller and more compact design */}
      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Type</th>
              <th style={{ width: '10%' }}>Severity</th>
              <th style={{ width: '30%' }}>Description</th>
              <th style={{ width: '20%' }}>Timestamp</th>
              <th style={{ width: '10%' }}>Actions</th>
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
                  {/* Flexbox to make buttons more compact */}
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => {
                        setSymptomType(symptom.symptomType);
                        setSeverity(symptom.severity);
                        setDescription(symptom.description);
                        setEditingId(symptom.id);
                      }}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => SymptomAPI.delete(symptom.id).then(fetchSymptoms)}
                    >
                      <i className="fas fa-trash-alt"></i> Delete
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






